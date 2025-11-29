import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import type { Bookmark } from '@/types/bookmark';
import {getBookmarks as getBookmarksAPI,getTrashedBookmarks,searchBookmarks as searchBookmarksApi} from '@/api/bookmark';

export const useBookmarkStore = defineStore('bookmark', () => {
    const searchResults = ref<Bookmark[]>([]);
    const _bookmarks = ref<Array<Bookmark>>([]);
    const trashBookmarks = ref<Array<Bookmark>>([]);
    const loading = ref<boolean>(true);
    const bookmarks = computed(() => _bookmarks.value);
    const bookmarksCount = computed(() => _bookmarks.value.length);
    const uncategorizedCount = computed(() => {
        return _bookmarks.value.filter(bookmark => !bookmark.tagIds || bookmark.tagIds.length === 0).length;
    })
    // 回收站书签数量
    const trashCount = ref(0)
    // 最近7天收藏
    const recentWeekBookmarks = computed(() => { {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return _bookmarks.value.filter(bookmark => new Date(bookmark.createdAt!) >= oneWeekAgo);
    } });
    // 未分类书签
    const uncategorizedBookmarks = computed(() => {  
        return _bookmarks.value.filter(bookmark => !bookmark.tagIds || bookmark.tagIds.length === 0);
    });
    // 根据标签id获取书签
    const getBookmarksByTagId = (tagId: number) => {
        return _bookmarks.value.filter(bookmark => bookmark.tagIds && bookmark.tagIds.includes(tagId));
    }
    // 获取所有书签
    const getBookmarks = async (): Promise<void> => {
        try{
            loading.value = true;
            const response = await getBookmarksAPI();
            const newData = response.data.map(bookmark => {
                return {...bookmark, 
                    tagIds:bookmark.tagIds?.split(',').map(id => parseInt(id))??[], 
                    tagNames: bookmark.tagNames?.split(',')??[]
                };
            });
            let initData: Bookmark[]= [
            {
                url: 'https://blog.csdn.net/weixin_44397974?type=blog',
                title: '作者的CSDN博客',
                description: '这是作者的CSDN博客，分享编程技术文章。',
                flag:'1',
                tagIds:[],
                tagNames: []
            }
    ]
            _bookmarks.value =initData.concat(newData);
        }catch(error){
            console.error('Failed to fetch bookmarks:', error);
        }finally{
            loading.value = false;
        }
    }
    // 获取回收站书签
    const getTrasBookmarks = async (): Promise<void> => {
        try{
            const response = await getTrashedBookmarks();
            trashCount.value = response.data.length;
            trashBookmarks.value = response.data.map(bookmark => {
                return {...bookmark, 
                    tagIds:bookmark.tagIds?.split(',').map(id => parseInt(id))??[], 
                    tagNames: bookmark.tagNames?.split(',')??[]
                };
            });
        }catch(error){
            console.error('Failed to fetch trashed bookmarks:', error);
        }
    }

    // 本地搜搜索书签
    const getBookmarksLocaly = (keyword: string): Bookmark[] => {
        const lowerKeyword = keyword.toLowerCase();
        if (!lowerKeyword) {
            return _bookmarks.value;
        }
        const filter =  _bookmarks.value.filter(bookmark =>
            bookmark.title.toLowerCase().includes(lowerKeyword) ||
            (bookmark.description && bookmark.description.toLowerCase().includes(lowerKeyword)) ||
            bookmark.url.toLowerCase().includes(lowerKeyword) || bookmark.tagNames?.some(tagName => tagName.toLowerCase().includes(lowerKeyword))
        );
        return filter
    }
    // 根据关键字搜索书签
    const searchBookmarks = async (keyword:string): Promise<void> => {
        const initData: Bookmark[] = [{
            url: 'https://blog.csdn.net/weixin_44397974?type=blog',
                title: '作者的CSDN博客',
                description: '这是作者的CSDN博客，分享编程技术文章。',
                flag:'1',
                tagIds:[],
                tagNames: []
        }]
         try {
             const results = await searchBookmarksApi(keyword);
              const newData = results.data.map(bookmark => {
                return {...bookmark, 
                    tagIds:bookmark.tagIds?.split(',').map(id => parseInt(id))??[], 
                    tagNames: bookmark.tagNames?.split(',')??[]
                };
            });
             searchResults.value = initData.concat(newData||[]);
             console.log('searchResults.value==',searchResults.value)
         }catch (error) {
             console.error('搜索失败:', error);
            searchResults.value = initData;
         }  
        };  
    return { 
            bookmarks,
            bookmarksCount, 
            loading,
            recentWeekBookmarks,
            uncategorizedBookmarks,
            uncategorizedCount,
            trashCount,
            trashBookmarks,
            searchResults,
            getBookmarksByTagId,
            getBookmarks,
            getTrasBookmarks,
            searchBookmarks
        }
})
