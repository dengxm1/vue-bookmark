<template>
  <div class="login-container">
    <div>
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
      
      <!-- 备案信息 -->
      <BeianInfo></BeianInfo>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'; // 添加了导入
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/api/auth';
import { useAuthStore } from '@/stores/auth'

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
        form.username = '全栈大佬';
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
</script>

<style scoped>
.app-title {
  margin-bottom: 30px;
  text-align: center;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f7fa;
  position: relative;
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