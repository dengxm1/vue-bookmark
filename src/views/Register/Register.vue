<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2>用户注册</h2>
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            maxlength="6"
            ref="usernameInput"
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
            autocomplete="off"
            :readonly="isReadonly"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
           maxlength="20"
           ref="passwordInput"
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            clearable
            autocomplete="new-password"
            :readonly="isReadonly"
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            style="width: 100%" 
            :loading="loading"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '立即注册' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-link">
        已有账号？<a @click="$router.push('/login')">立即登录</a>
      </div>
    </el-card>
    <BeianInfo dark></BeianInfo>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { register } from '@/api/auth';
import {useAuthStore} from '@/stores/auth'

const router = useRouter();
const loading = ref(false);
const formRef = ref<FormInstance>();
const isReadonly = ref(true);
const usernameInput = ref();
const passwordInput = ref();

const authStore = useAuthStore();
// 表单数据
const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

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
    });
  }, 500);
});

// 自定义验证规则 - 确认密码
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3 到 20 个字符', trigger: 'blur' },
    // { 
    //   pattern: /^[a-zA-Z0-9_]+$/, 
    //   message: '用户名只能包含字母、数字和下划线', 
    //   trigger: 'blur' 
    // }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6 到 20 个字符', trigger: 'blur' },
    // { 
    //   pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, 
    //   message: '密码必须包含字母和数字', 
    //   trigger: 'blur' 
    // }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

// 处理注册
const handleRegister = async () => {
  if (!formRef.value) return;
  
  // 表单验证
  try {
    await formRef.value.validate();
  } catch (error) {
    console.log('error==',error)
    ElMessage.warning('请完善表单信息');
    return;
  }
  loading.value = true;
  try {
    await authStore.register({
      username: form.username,
      password: form.password
    });
    
    ElMessage.success('注册成功！');
    // 跳转到首页
    router.push('/');
    
  } catch (error: any) {
    // 错误信息已经在拦截器中显示了
    console.error('注册失败:', error);
  } finally {
    loading.value = false;
  }
};

// 回车键注册
const handleKeypress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleRegister();
  }
};

// 添加键盘事件监听
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  document.addEventListener('keypress', handleKeypress);
});

onUnmounted(() => {
  document.removeEventListener('keypress', handleKeypress);
});
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 450px;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.register-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  border-radius: 6px;
}
/* 备案信息样式 */
.beian-info {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  padding: 0 20px;
}

.beian-content {
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.beian-link {
  color: rgba(255, 255, 255, 0.8); /* 白色带透明度 */
  text-decoration: none;
  font-size: 12px;
  transition: all 0.3s;
}

.beian-link:hover {
  color: #ffffff; /* 悬停时完全白色 */
  text-decoration: underline;
}

.beian-separator {
  color: rgba(255, 255, 255, 0.5); /* 浅灰色分隔符 */
  font-size: 12px;
  margin: 0 8px;
}

.beian-pending {
  color: rgba(255, 255, 255, 0.7); /* 稍浅的白色 */
  font-size: 12px;
}

.copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  line-height: 1.5;
}

</style>