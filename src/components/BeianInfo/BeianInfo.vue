<template>
  <div class="beian-info" :class="{ 'light-theme': dark }">
   <div class="beian-info-wrapper">
     <!-- 备案信息行 -->
    <div class="beian-content">
      <!-- ICP备案号 -->
      <a 
        href="https://beian.miit.gov.cn/" 
        target="_blank"
        class="beian-link"
      >
        闽ICP备2025117937号
      </a>
      
      <span class="beian-separator">|</span>

      <!-- 公安备案号（审核通过后取消注释并替换） -->
        <a 
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35010402351754" 
          target="_blank"
          class="beian-link"
        >
         <img
          style="width: 20px; height: 20px;margin-right: 4px;"
          :src="beianLogo"
        ></img>
          闽公网安备35010402351754号
        </a>
      
    </div>
    
    <!-- 新增：投诉举报信息行 -->
    <div class="complaint-info">
      <span class="complaint-text">投诉举报请联系：</span>
      <span class="complaint-email">
        1148926496@qq.com
      </span>
    </div>
   </div>
    
    <!-- 版权信息行 -->
    <div class="copyright">
      Copyright © {{ currentYear }} 智能书签收藏夹 版权所有
    </div>
  </div>
</template>

<script setup lang="ts">
import beianLogo from '@/assets/beian_logo.png'
const currentYear = new Date().getFullYear()
interface Props {
    dark?: boolean
}
const { dark = false} = defineProps<Props>()
</script>

<style scoped>
/* 备案信息样式 */
.beian-info {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px; /* 增加行间距 */
}
.beian-info-wrapper{
  display: flex;
  justify-content: center;
}

.beian-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 新增：投诉举报信息样式 */
.complaint-info {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  margin-left: 20px;
}

.complaint-text {
  color: #606266;
  margin-right: 4px;
}

.complaint-email {
  color: #606266;
  text-decoration: none;
  transition: color 0.3s;
}


.beian-link {
  color: #606266;
  text-decoration: none;
  font-size: 12px;
  transition: color 0.3s;
  display: flex;
  align-items: center;
}

.beian-link:hover {
  color: #409eff;
  text-decoration: underline;
}

.beian-separator {
  color: #dcdfe6;
  font-size: 12px;
  margin: 0 4px;
}

.beian-pending {
  color: #909399;
  font-size: 12px;
}

.copyright {
  color: #909399;
  font-size: 12px;
}

/* 浅色主题样式 */
.beian-info.light-theme .beian-link,
.beian-info.light-theme .complaint-text,
.beian-info.light-theme .complaint-email {
  color: rgba(255, 255, 255, 0.8);
}

.beian-info.light-theme .beian-link:hover,
.beian-info.light-theme .complaint-email:hover {
  color: #ffffff;
}

.beian-info.light-theme .beian-separator {
  color: rgba(255, 255, 255, 0.5);
}

.beian-info.light-theme .beian-pending {
  color: rgba(255, 255, 255, 0.7);
}

.beian-info.light-theme .copyright {
  color: rgba(255, 255, 255, 0.8);
}
</style>