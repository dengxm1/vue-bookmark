<template>
  <el-card class="bookmark-card" shadow="hover" body-style="padding: 16px;">
    <!-- 卡片头部 -->
    <div class="card-header">
      <div class="favicon-container">
        <!-- <img 
          v-if="bookmark.favicon" 
          :src="bookmark.favicon" 
          :alt="bookmark.title"
          class="favicon"
        /> -->
        <div  class="favicon-placeholder">
          {{ getFaviconPlaceholder(bookmark.title) }}
        </div>
      </div>
      
      <el-dropdown v-if="!bookmark.flag" @command="handleCardCommand" trigger="click">
        <el-button text :icon="MoreFilled" class="card-menu" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="list in commandList" :command="list.command">{{ list.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-content" @click="handleCardClick">
      <h3 class="bookmark-title" :title="bookmark.title">
        {{ bookmark.title }}
      </h3>
      
      <p class="bookmark-url" :title="bookmark.url">
        {{ bookmark.url }}
      </p>
      
      <div v-if="bookmark.description" class="bookmark-description">
        {{ bookmark.description }}
      </div>
    </div>
    
    <!-- 卡片底部 -->
    <div class="card-footer">
      <div class="tags">
        <el-tag
          v-for="tag in bookmark.tagNames"
          :key="tag"
          size="small"
          type="info"
          effect="plain"
          class="tag"
        >
          {{ tag }}
        </el-tag>
      </div>
      
      <div class="time">
        {{ formatTime(bookmark.createdAt) }}
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue'
import type { Bookmark } from '@/types/bookmark'

interface Props {
  bookmark: Bookmark,
  activeMenu: string
}

interface Emits {
  (e: 'click', bookmark: Bookmark): void
  (e: 'command', command: string, bookmark: Bookmark): void
}

const commandList = reactive([
  { command: 'edit', label: '编辑' },
  { command: 'copy', label: '复制链接' },
  { command: 'delete', label: '删除' }
])

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

watch(() => props.activeMenu, (newVal) => {
    if(newVal === 'trash'){
      commandList.splice(0, commandList.length, 
        { command: 'restore', label: '还原' },
        { command: 'deletePermanent', label: '永久删除' }
      );
    } else {
      commandList.splice(0, commandList.length, 
        { command: 'edit', label: '编辑' },
        { command: 'copy', label: '复制链接' },
        { command: 'delete', label: '删除' }
      );
    }
}, { immediate: true })

const getFaviconPlaceholder = (title: string): string => {
  return title.charAt(0).toUpperCase()
}

const formatTime = (time: Date|string | undefined | null): string => {
 if (time === undefined || time === null) {
    return ''
  }
  const timeDate = typeof time === 'string' ? new Date(time) : time
  const now = new Date()
  const diff = now.getTime() - timeDate.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return `${Math.floor(days / 30)}月前`
}

const handleCardClick = () => {
  emit('click', props.bookmark)
}

const handleCardCommand = (command: string) => {
  emit('command', command, props.bookmark)
}
</script>

<style scoped>
.bookmark-card {
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bookmark-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.favicon-container {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.favicon {
  width: 20px;
  height: 20px;
}

.favicon-placeholder {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
}

.card-menu {
  padding: 4px;
}

.card-content {
  margin-bottom: 16px;
}

.bookmark-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bookmark-url {
  font-size: 12px;
  color: #909399;
  margin: 0 0 8px 0;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bookmark-description {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
}

.tag {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 11px;
  color: #c0c4cc;
  white-space: nowrap;
  margin-left: 8px;
}
</style>