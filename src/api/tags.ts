import request from './request';
import type { Tag } from '@/types';


// 获取标签分类
export const getTags = (): Promise<{ data: Tag[] }> => {
  return request.get('/tags');
}

// 新增标签
export const createTag = (data: { name: string }): Promise<any> => {
  return request.post('/tags', data);
}

// 删除标签
export const deleteTag = (ids: number[]): Promise<any> => {
  return request.post('/tags/delete', { ids });
}

// 编辑标签
export const editTag = (data: { id: number; name: string }): Promise<any> => {
  return request.put('/tags/update', data);
}