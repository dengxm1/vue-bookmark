<template>
  <el-header class="app-header">
    <div class="header-left">
      <div class="logo">
        <span class="logo-icon">📚</span>
        <h1 class="logo-text">智能书签收藏夹</h1>
      </div>
    </div>
    
    <div class="header-center">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索书签..."
        class="search-input"
        :prefix-icon="Search"
        @input="handleSearch"
      />
    </div>
    
    <div class="header-right">
      <el-button 
        type="primary" 
        :icon="Plus" 
        @click="emit('addBookmark')"
      >
        添加书签
      </el-button>
      
      <el-dropdown @command="handleUserCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="user.avatar">
            {{ user.username.charAt(0) }}
          </el-avatar>
          <span class="username">{{ user.username }}</span>
          <el-icon><arrow-down /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item command="profile">个人资料</el-dropdown-item> -->
            <!-- <el-dropdown-item command="settings">设置</el-dropdown-item> -->
            <el-dropdown-item  command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus, ArrowDown } from '@element-plus/icons-vue'
import type { User } from '@/types'

interface Props {
  user: User
}

interface Emits {
  (e: 'addBookmark'): void
  (e: 'search', keyword: string): void
  (e: 'userCommand', command: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter();


const searchKeyword = ref('')

const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const handleUserCommand = (command: string) => {
  emit('userCommand', command)
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-center {
  flex: 1;
  max-width: 400px;
  margin: 0 40px;
}

.search-input {
  width: 100%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>