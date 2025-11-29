<template>
  <div class="dashboard">
    <Header
      :user="authStore.user"
      @add-bookmark="addBookmar"
      @search="handleSearch"
      @user-command="handleUserCommand"
    />
    
    <div class="main-content">
      <Sidebar
        :tags="tagStore.tags"
        @menu-select="handleMenuSelect"
        @editTags="showEditTagDialog"
        @deleteTags="deleteTags"
      />
      
      <div class="content-area">
        <!-- 空状态 -->
        <div v-if="bookmarkStore.bookmarksCount === 0 && !bookmarkStore.loading" class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>还没有收藏任何书签</h3>
          <p>点击下方按钮开始添加你的第一个书签</p>
          <el-button type="primary" :icon="Plus" @click="addBookmar">
            添加书签
          </el-button>
        </div>
        <view class="empty-state" v-if="bookmarkStore.bookmarksCount != 0 && bookmarkList.length == 0">
          <el-empty description="暂无数据" />
        </view>
        <!-- 书签网格 -->
        <div v-else class="bookmarks-grid">
          <BookmarkCard
            v-for="bookmark in bookmarkList"
            :key="bookmark.id"
            :bookmark="bookmark"
            :activeMenu="activeMenu"
            @click="handleBookmarkClick"
            @command="handleBookmarkCommand"
          />
        </div>
      </div>
    </div>
    
    <!-- 添加书签对话框 -->
    <AddBookmarkDialog
      :initData="initData"
      :addType="addType"
      v-model="showAddDialog"
      :available-tags="tagStore.tags"
      @submit="handleAddBookmark"
    />

    <!-- 添加标签对话框 -->
    <TagsDialog
      :initData="initTagsData"
      v-model="showTagsDialog"
      @addTag="handleAddTag"
      @editTag="handleEditTag"
   ></TagsDialog>
   
    <BeianInfo></BeianInfo>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import Header from '@/components/Layout/Header.vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import type { Bookmark} from '@/types'
import {useAuthStore} from '@/stores/auth'
import {useTagsStore} from '@/stores/tags'
import {useBookmarkStore} from '@/stores/bookmark'
import TagsDialog from './components/TagsDialog/TagsDialog.vue'
import {createBookmark as createBookmarkApi,deleteBookmark,updateBookmark,softDelete,restoreBookmark,searchBookmarks} from '@/api/bookmark'
import {createTag,editTag} from '@/api/tags'

const authStore = useAuthStore();
const bookmarkStore = useBookmarkStore();
const tagStore = useTagsStore();


const bookmarks = ref<Bookmark[]>([])
const addType  = ref('add')
const searchKeyword = ref('')
const searchResults = ref<Bookmark[]>([]);

interface InitData {
  id:number,
  url: string
  title: string
  tags: number[]
  description: string
}

const initData = ref<any>(null)
const initTagsData = ref<any>(null)


tagStore.getTags() //获取标签列表
bookmarkStore.getBookmarks() //获取书签列表
bookmarkStore.getTrasBookmarks() //获取回收站书签列表

const showAddDialog = ref(false)
const showTagsDialog = ref(false)
const activeMenu = ref('all')

const bookmarkList = computed(() => {
  if (searchKeyword.value) {
    console.log('bookmarkStore.searchResults==',bookmarkStore.searchResults)
    return bookmarkStore.searchResults;
  }
  switch(activeMenu.value){
    case 'all':
      console.log('alllallll==',bookmarkStore.bookmarks)
      return bookmarkStore.bookmarks
    case 'uncategorized':
     return bookmarkStore.uncategorizedBookmarks
    case 'recent':
      return bookmarkStore.recentWeekBookmarks
    case 'trash':
      return bookmarkStore.trashBookmarks
    case 'new-tag':
      return []
    default:
      if(activeMenu.value.startsWith('tag-')){
         const tagIdStr = activeMenu.value.split('-')[1];
         if(tagIdStr){
           const tagId = parseInt(tagIdStr);
           if(!isNaN(tagId)){
              return bookmarkStore.getBookmarksByTagId(tagId);
           }
         }
      }
      return bookmarkStore.bookmarks
  }
}
)


const handleSearch = async (keyword: string) => {
  searchKeyword.value = keyword
  if(!keyword) return
  try {
    await bookmarkStore.searchBookmarks(keyword);
  } catch (error) {
    console.error('搜索书签失败:', error);
  }
}

const handleMenuSelect = (key: string) => {
  if(key === 'new-tag'){
    console.log('新建标签')
    initTagsData.value = null
    showTagsDialog.value = true
    return
  }
  activeMenu.value = key
}

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'logout':
      authStore.logout()
      break
    case 'profile':
      console.log('个人资料')
      break
    case 'settings':
      console.log('设置')
      break
  }
}

const addBookmar = () => {
  initData.value = null
  showAddDialog.value = true
}

const handleBookmarkClick = (bookmark: Bookmark) => {
  window.open(bookmark.url, '_blank')
}

const handleBookmarkCommand = (command: string, bookmark: Bookmark) => {
  switch (command) {
    case 'edit':
      console.log('编辑书签:', bookmark)
      initData.value = {
        id: bookmark.id!,
        url: bookmark.url,
        title: bookmark.title,
        tags: bookmark.tagIds,
        description: bookmark.description || ''
      }
      showAddDialog.value = true
      break
    case 'copy':
      navigator.clipboard.writeText(bookmark.url)
      ElMessage.success('链接已复制到剪贴板')
      break
    case 'delete':
      handlesoftDelBookmark(bookmark)
      break
    case 'restore':
      handleRestoreBookmark(bookmark.id!)
      break
    case 'deletePermanent':
      handleDeleteBookmark(bookmark)
      break
  }
}

const handleRestoreBookmark = (id:number) => {
  ElMessageBox.confirm('确定要还原这个书签吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    restoreBookmark(id).then(() => {
      ElMessage.success('书签还原成功')
      bookmarkStore.getBookmarks(); //重新获取书签列表
      tagStore.getTags(); //重新获取标签列表
      bookmarkStore.getTrasBookmarks() //获取回收站书签列表
    }).catch((error) => {
      console.error('还原书签失败:', error);
    });
  })
}

// 新增书签
const handleAddBookmark = async (formData: any) => {
  console.log('formData:', formData)
  try {
    if(formData.id){
      await updateBookmark(formData.id, {
        url: formData.url,
        title: formData.title,
        description: formData.description,
        tagIds: formData.tags.join(',')
      });
    }else{
      await createBookmarkApi({
        url: formData.url,
        title: formData.title,
        description: formData.description,
        tagIds: formData.tags.join(',')
      });
    }
  let msg = formData.id ? '书签更新成功' : '书签添加成功'
    ElMessage.success(msg)
    bookmarkStore.getBookmarks(); //重新获取书签列表
    tagStore.getTags(); //重新获取标签列表
  } catch (error) {
    console.error('添加书签失败:', error);
  }
}

//永久删除书签
const handleDeleteBookmark = (bookmark: Bookmark) => {
  ElMessageBox.confirm('确定要永久删除这个书签吗？此操作不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteBookmark([bookmark.id!]).then(() => {
      ElMessage.success('书签永久删除成功')
       bookmarkStore.getTrasBookmarks() //获取回收站书签列表
    }).catch((error) => {
      console.error('永久删除书签失败:', error);
    });
  })
}

// 删除书签
const handlesoftDelBookmark = (bookmark: Bookmark) => {
  ElMessageBox.confirm('确定要删除这个书签吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    softDelete(bookmark.id!).then(() => {
      ElMessage.success('书签删除成功')
      bookmarkStore.getBookmarks(); //重新获取书签列表
      tagStore.getTags(); //重新获取标签列表
      bookmarkStore.getTrasBookmarks() //获取回收站书签列表
    }).catch((error) => {
      console.error('删除书签失败:', error);
    });
  })
}
// 新增标签
const handleAddTag = async (formData: any) => {
  console.log('新增标签 formData:', formData)
  try {
    await createTag({
      name: formData.name
    });
    ElMessage.success('标签添加成功')
    tagStore.getTags(); //重新获取标签列表
  } catch (error) {
    console.error('添加标签失败:', error);
  }
}

const handleEditTag = async (formData: any) => {
  console.log('修改标签 formData:', formData)
  try {
    await editTag({
      id: formData.id,
      name: formData.name
    });
    ElMessage.success('重命名成功')
    tagStore.getTags(); //重新获取标签列表
    bookmarkStore.getBookmarks(); //重新获取书签列表
    bookmarkStore.getTrasBookmarks() //获取回收站书签列表
  } catch (error) {
    console.error('修改标签失败:', error);
  }
} 

// 显示修改标签
const  showEditTagDialog = async (tagData: any) => {
  initTagsData.value = {
    id: tagData.id,
    name: tagData.name
  }
  showTagsDialog.value = true
} 

const deleteTags = async (tagData: any) => {
  ElMessageBox.confirm('确定要删除这个标签吗？删除后该标签下的书签将被移至未分类。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    tagStore.deleteTag([tagData.id]).then(() => {
      ElMessage.success('标签删除成功')
      tagStore.getTags(); 
      bookmarkStore.getBookmarks(); //重新获取书签列表
      bookmarkStore.getTrasBookmarks() //获取回收站书签列表
    }).catch((error) => {
      console.error('删除标签失败:', error);
    });
  })
}

onMounted(() => {
  console.log('Dashboard mounted')
})
</script>

<style scoped>
.dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f5f7fa;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #909399;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #606266;
}

.empty-state p {
  margin-bottom: 24px;
  color: #909399;
}

.bookmarks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  align-items: start;
}

@media (max-width: 1200px) {
  .bookmarks-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .bookmarks-grid {
    grid-template-columns: 1fr;
  }
  
  .content-area {
    padding: 16px;
  }
}
</style>