import request from './request';
import type { Bookmark,resBookmarkData } from '../types/bookmark';

export interface CreateBookmarkData {
  url: string;
  title: string;
  description?: string;
  tagIds?: string[];
}

// 获取所有书签
export const getBookmarks = (): Promise<{ data: resBookmarkData[] }> => {
  return request.get('/bookmarks');
};

// 创建书签
export const createBookmark = (data: CreateBookmarkData): Promise<any> => {
  return request.post('/bookmarks', data);
};

// 更新书签
export const updateBookmark = (id: number, data: Partial<CreateBookmarkData>): Promise<any> => {
  return request.put(`/bookmarks/${id}`, data);
};

// 永久删除书签
export const deleteBookmark = (ids: number[]): Promise<any> => {
  return request.post('/bookmarks/delete',{ids});
};

// 搜索书签
export const searchBookmarks = (keyword: string): Promise<{ data: resBookmarkData[] }> => {
  return request.get(`/bookmarks/search?q=${encodeURIComponent(keyword)}`);
};
// 获取回收站书签
export const getTrashedBookmarks = (): Promise<{ data: resBookmarkData[] }> => {
  return request.get('/bookmarks/getTrashedBookmarks');
};

// 移动到回收站
export const softDelete = (id:number): Promise<{ data: resBookmarkData[] }> => {
  return request.delete(`/bookmarks/${id}`);
};

// 恢复书签
export const restoreBookmark = (id:number): Promise<{ data: Bookmark[] }> => {
  return request.put(`/bookmarks/restore/${id}`);
}