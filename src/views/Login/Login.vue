<template>
  <div class="login-container">
    <div class="header-container">
       <el-menu
            mode="horizontal"
            background-color="transparent"
            text-color="#333"
            active-text-color="#409EFF"
            class="nav-menu"
            :ellipsis="false"
            :router="false"
            @select="handleMenuSelect"
          >
          <el-sub-menu index="1">
            <template #title>
              <div class="menu-title">
               <img :src="githubImg" alt="GitHub" class="github-img"/>
                <span>项目仓库</span>
            </div>
            </template>
            <el-menu-item index="external-vue" >
              <el-icon><Monitor /></el-icon>
              <span>前端项目 (Vue 3)</span>
            </el-menu-item>
            <el-menu-item index="external-springboot">
              <el-icon><Cpu /></el-icon>
              <span>后端项目 (SpringBoot)</span>
            </el-menu-item>
          </el-sub-menu>
      </el-menu>
    </div>
    <div class="login-form">
      <div class="app-title">
        <h1>智能书签收藏夹</h1>
      </div>
      <el-card class="login-card">
        <h4 style="margin-bottom: 10px;">登录</h4>
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item prop="username">
            <el-input
              maxlength="6"
              ref="usernameInput"
              v-model="form.username"
              placeholder="用户名"
              prefix-icon="User"
              autocomplete="off"
              :readonly="isReadonly"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              maxlength="20"
              ref="passwordInput"
              v-model="form.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              show-password
              autocomplete="new-password"
              :readonly="isReadonly"
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              style="width: 100%" 
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-link">
          没有账号？<a @click="$router.push('/register')">立即注册</a>
        </div>
      </el-card>
    </div>
          <!-- 备案信息 -->
      <BeianInfo></BeianInfo>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'; // 添加了导入
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/api/auth';
import { useAuthStore } from '@/stores/auth'
import githubImg from '@/assets/github.png';
import {
  Collection,
  Monitor,
  Cpu,
  SetUp,
  Mic
} from '@element-plus/icons-vue';

const router = useRouter();
const loading = ref(false);
const formRef = ref();
const isReadonly = ref(true);
const usernameInput = ref();
const passwordInput = ref();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

// 组件挂载后延迟清空，确保在自动填充之后执行
onMounted(() => {
  // 延迟移除 readonly，确保在自动填充之后
  setTimeout(() => {
    isReadonly.value = false;
    form.username = '';
    form.password = '';
    
    // 强制清空输入框的 DOM 值
    nextTick(() => {
      if (usernameInput.value && usernameInput.value.input) {
        usernameInput.value.input.value = '';
      }
      if (passwordInput.value && passwordInput.value.input) {
        passwordInput.value.input.value = '';
      }
        // 延迟设置默认值，确保在清空之后
      setTimeout(() => {
        form.username = 'admin';
        form.password = '123456';
      }, 100);
    });
  }, 500);
});

const handleLogin = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (!valid) return;
  loading.value = true;
  try {
   const result =  await authStore.login(form);
    if (result) {
      ElMessage.success('登录成功');
      router.push('/');
    }
  } catch (error) {
    // 错误已经在拦截器中处理了
  } finally {
    loading.value = false;
  }
};

const handleMenuSelect = (index: string) => {
  switch (index) {
    case 'external-vue':
      window.open('https://github.com/dengxm1/vue-bookmark', '_blank');
      break;
    case 'external-springboot':
      window.open('https://github.com/dengxm1/springboot-bookmark', '_blank');
      break;
  }
  
  // 移除激活状态
  removeActiveState();
};

const removeActiveState = () => {
  // 延迟执行，确保点击完成
  setTimeout(() => {
    const activeItems = document.querySelectorAll('.el-menu-item.is-active');
    activeItems.forEach(item => {
      item.classList.remove('is-active');
    });
    
    const activeSubmenus = document.querySelectorAll('.el-sub-menu.is-active');
    activeSubmenus.forEach(item => {
      item.classList.remove('is-active');
    });
  }, 100);
};

</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.nav-menu {
  border: none;
  background: transparent !important;
  display: flex;
  align-items: center;
}

.menu-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.el-menu--horizontal) {
  border-bottom: none !important;
}

:deep(.el-menu--horizontal > .el-menu-item),
:deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  border-bottom: 2px solid transparent;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active),
:deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title) {
  border-bottom-color: #409EFF;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 10px;
  }
  
  .menu-title span {
    display: none;
  }
}

.app-title {
  margin-bottom: 30px;
  text-align: center;
}

.login-form{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.github-button{
  border: none;
}
.header-container{
 display:flex;
 align-items: center;
 padding: 20px;
 justify-content: end;
}

.github-img{
  width: 32px;
  height: 32px;
}
.github-text{
  font-size: 16px;
  margin-left:8px;
}
.el-icon--right{
  color: #333333;
  font-size: 16px;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #409eff;
  cursor: pointer;
}

/* 响应式设计 */
@media (max-height: 600px) {
  .beian-info {
    position: relative;
    margin-top: 30px;
    bottom: auto;
  }
}

@media (max-width: 480px) {
  .beian-content {
    flex-direction: column;
    gap: 4px;
  }
  
  .beian-separator {
    display: none;
  }
}
</style>