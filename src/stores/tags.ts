import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Tag } from '@/types'
import { getTags as getTagsApi,deleteTag as deleteTagApi } from '@/api/tags'

export const useTagsStore = defineStore('tags', () => {
  const tags = ref<Tag[]>([])
  const getTags = async (): Promise<void> => {
    try{
      const response = await getTagsApi();
      tags.value = response.data;
    }catch(error){ 
      throw error
    }finally{ }  
  }
  const deleteTag = async (ids: number[]): Promise<void> => {
    try{
      await deleteTagApi(ids);
      // 删除成功后更新本地标签列表
      getTags();
    }catch(error){ 
      throw error
    }finally{ }
  }
  return { tags,  getTags, deleteTag}
})
