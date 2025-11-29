
export interface Bookmark {
    id?: number,
    userId?: number,
    url: string,
    title: string,
    description?: string,
    createdAt?: Date,
    updatedAt?: Date,
    tagIds: number[],
    tagNames: string[],
    flag?: string|number
}
export interface resBookmarkData {
    id?: number,
    userId?: number,
    url: string,
    title: string,
    description?: string,
    createdAt?: Date,
    updatedAt?: Date,
    tagIds: string,
    tagNames: string,
    flag?: string|number
}


export interface User {
  id: number;
  username: string;
  avatar?: string;
}