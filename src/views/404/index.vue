<!-- src/views/404/index.vue -->
<template>
  <div class="not-found-container">
    <div class="not-found-card">
      <!-- 404 动画图标 -->
      <div class="error-icon">
        <el-icon class="main-icon">
          <WarningFilled />
        </el-icon>
        <div class="error-code">
          <span class="number">4</span>
          <span class="number zero">0</span>
          <span class="number">4</span>
        </div>
      </div>

      <!-- 提示信息 -->
      <h2 class="title">哎呀！页面走丢了</h2>
      <p class="subtitle">您访问的路径不存在，看起来您可能想去别的项目？</p>
      
      <!-- 路径提示（根据路径显示不同内容） -->
      <div class="path-message" v-if="pathMessage !== '您访问的页面不存在'">
        {{ pathMessage }}
      </div>

      <!-- 项目选择卡片 -->
      <div class="project-cards">
        <!-- 当前项目（书签） -->
        <div class="project-card current" @click="goToBookmark">
          <el-icon class="card-icon"><Collection /></el-icon>
          <h3>智能书签</h3>
          <p>返回书签项目首页</p>
          <el-button type="primary" size="small" :icon="Back">前往</el-button>
        </div>

        <!-- 电商项目 -->
        <div class="project-card" @click="goToEcommerce">
          <el-icon class="card-icon"><ShoppingCart /></el-icon>
          <h3>电商管理</h3>
          <p>前往电商项目首页</p>
          <el-button type="success" size="small" :icon="ArrowRight">前往</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  WarningFilled,
  Collection,
  ShoppingCart,
  Back,
  ArrowRight,
  Search
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const showSearch = ref(true)

const currentPath = ref('')


onMounted(() => {
  currentPath.value = route.fullPath
  
  console.warn(`[404] 页面不存在: ${currentPath.value}`)
})

const goToBookmark = () => {
  router.push('/')
}

const goToEcommerce = () => {
  window.location.href = 'https://dengxinyi.cn/ecommerce/'
}


const pathMessage = computed(() => {
  const path = currentPath.value
  
  if (path.startsWith('/ecom')) {
    return '您似乎想访问电商管理后台，但路径拼写有误'
  } else if (path.startsWith('/admin')) {
    return '管理员入口已迁移'
  } else {
    return '您访问的页面不存在'
  }
})
</script>

<style scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  margin: 0;
  box-sizing: border-box;
}

.not-found-card {
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease;
  box-sizing: border-box;
}

.error-icon {
  text-align: center;
  margin-bottom: 20px;
}

.main-icon {
  font-size: 80px;
  color: #f56c6c;
  animation: pulse 2s infinite;
}

.error-code {
  margin-top: 10px;
}

.number {
  font-size: 60px;
  font-weight: bold;
  color: #333;
  display: inline-block;
  animation: bounce 2s ease infinite;
  margin: 0 5px;
}

.number.zero {
  color: #f56c6c;
  animation-delay: 0.2s;
}

.number:nth-child(1) {
  animation-delay: 0s;
}

.number:nth-child(2) {
  animation-delay: 0.2s;
}

.number:nth-child(3) {
  animation-delay: 0.4s;
}

.title {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.path-message {
  text-align: center;
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 20px;
  padding: 10px;
  background: #fef0f0;
  border-radius: 8px;
}

.project-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.project-card {
  flex: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.project-card.current {
  border-color: #409eff;
}

.card-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #909399;
}

.project-card.current .card-icon {
  color: #409eff;
}

.project-card h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.project-card p {
  font-size: 14px;
  color: #999;
  margin: 0 0 15px 0;
}

.search-suggestion {
  margin-top: 20px;
}

.suggestion-text {
  text-align: center;
  color: #999;
  margin: 15px 0;
  font-size: 14px;
}

.debug-info {
  margin-top: 20px;
}

.debug-text {
  font-size: 12px;
  color: #999;
  text-align: center;
  font-family: monospace;
  margin: 10px 0 0 0;
  line-height: 1.6;
}

/* 动画定义 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-card {
    padding: 30px 20px;
  }
  
  .main-icon {
    font-size: 60px;
  }
  
  .number {
    font-size: 40px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .project-cards {
    flex-direction: column;
    gap: 15px;
  }
  
  .project-card {
    padding: 20px;
  }
  
  .card-icon {
    font-size: 40px;
  }
}

@media (max-width: 480px) {
  .not-found-card {
    padding: 20px 15px;
  }
  
  .main-icon {
    font-size: 50px;
  }
  
  .number {
    font-size: 32px;
    margin: 0 3px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .project-card h3 {
    font-size: 16px;
  }
  
  .project-card p {
    font-size: 12px;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .not-found-container {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }
  
  .not-found-card {
    background: rgba(30, 30, 40, 0.95);
  }
  
  .number {
    color: #fff;
  }
  
  .title {
    color: #fff;
  }
  
  .subtitle {
    color: #aaa;
  }
  
  .project-card {
    background: #2a2a3a;
  }
  
  .project-card h3 {
    color: #fff;
  }
  
  .project-card p {
    color: #aaa;
  }
  
  .path-message {
    background: rgba(245, 108, 108, 0.2);
    color: #ff9c9c;
  }
}
</style>