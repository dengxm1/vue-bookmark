<template>
  <el-aside class="app-sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      @select="handleMenuSelect"
      :default-openeds="['tags']"
    >
      <!-- 基础分类 -->
      <el-menu-item index="all">
        <el-icon><Collection /></el-icon>
        <span>所有书签</span>
        <el-tag v-if="bookmarkStore.bookmarksCount" size="small" type="info">
          {{ bookmarkStore.bookmarksCount }}
        </el-tag>
      </el-menu-item>
      
      <el-menu-item index="uncategorized">
        <el-icon><Folder /></el-icon>
        <span>未分类</span>
        <el-tag v-if="bookmarkStore.uncategorizedCount" size="small" type="warning">
          {{ bookmarkStore.uncategorizedCount }}
        </el-tag>
      </el-menu-item>
      
      <el-menu-item index="recent">
        <el-icon><Clock /></el-icon>
        <span>最近收藏</span>
      </el-menu-item>
      
      <!-- 标签分类 -->
      <el-sub-menu index="tags">
        <template #title>
          <el-icon><PriceTag /></el-icon>
          <span>标签分类</span>
        </template>
        
        <el-menu-item 
          v-for="tag in tags" 
          :key="tag.id" 
          :index="`tag-${tag.id}`"
        >
          <span class="tag-item">
              <span class="tags-left">
                <span class="tag-name">{{ tag.name }}</span>
                <el-tag v-if="tag.bookmarkCount > 0" size="small" type="info" class="tag-num">
                  {{ tag.bookmarkCount }}
                </el-tag>
              </span>
              <el-dropdown  @command="(commad) => handleTagsCommand(commad,tag)">
                <el-icon class="tag-command-dropdwown"><MoreFilled /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="list in tagCommandList" :command="list.command">{{ list.label }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
              </el-dropdown>
          </span>
        </el-menu-item>
        
        <el-divider />
        
        <el-menu-item index="new-tag" class="new-tag-item">
          <el-icon><Plus /></el-icon>
          <span>新建标签</span>
        </el-menu-item>
      </el-sub-menu>
      
      <!-- 回收站 -->
      <el-menu-item index="trash">
        <el-icon><Delete /></el-icon>
        <span>回收站</span>
        <el-tag v-if="bookmarkStore.trashCount" size="small" type="danger">
          {{ bookmarkStore.trashCount }}
        </el-tag>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Collection, Folder, Clock, PriceTag, 
  Plus, Delete,MoreFilled
} from '@element-plus/icons-vue'
import type { Tag } from '@/types'
import { useBookmarkStore } from '@/stores/bookmark'

const bookmarkStore = useBookmarkStore();

interface Props {
  tags: Tag[]
}

interface Emits {
  (e: 'menuSelect', key: string): void
  (e: 'editTags', key: object): void
  (e: 'deleteTags', key: object): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const tagCommandList = [
  { command: 'edit', label: '重名名' },
  { command: 'delete', label: '删除' }
]

const activeMenu = ref('all')

const handleMenuSelect = (key: string) => {
  console.log('选中菜单:', key)
  if(key != 'new-tag'){
      activeMenu.value = key
  }
   emit('menuSelect', key)
}

const handleTagsCommand = (command: string, tags: any) => {
  if(command === 'delete'){
     emit('deleteTags', tags)
  }else if(command === 'edit'){
     emit('editTags', tags)
  }
}
</script>

<style scoped>
.app-sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
}

.sidebar-menu {
  border: none;
  padding: 16px 0;
}

.sidebar-menu .el-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  margin: 0 8px;
  border-radius: 6px;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #ecf5ff;
  color: #409eff;
}

.tag-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.tag-name {
  flex: 1;
}
.tag-num{
  margin-left: 8px;
}
.new-tag-item {
  color: #409eff;
}

.new-tag-item .el-icon {
  color: #409eff;
}
.tags-left{
  display: flex;
  align-items: center;
}
/* .dropdwown{
  font-size: 12px !important;
} */
</style>