<template>
  <teleport to="body">
    <el-dialog
      v-model="visible"
      :title="form.id?'重命名':'新建标签'"
      width="500px"
      :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="名称" prop="name">
        <el-input
         maxlength="6"
          v-model="form.name"
          placeholder="请输入标签名称"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
  </teleport>
  
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules} from 'element-plus'
import { Link, Document } from '@element-plus/icons-vue'
import type { Tag } from '@/types'

interface FormData {
  id?:number,
  name: string
}

interface Emits {
  (e: 'addTag', data: FormData): void
  (e: 'editTag', data: FormData): void
  (e: 'update:modelValue', value: boolean): void
}

interface Props {
  modelValue: boolean,
  initData?:FormData
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = ref(props.modelValue)
const loading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive<FormData>({
  name: ''
})

watch(() => props.initData, (val) => {
  if(val){
    form.id = val.id
    form.name = val.name
  }else{
    form.id = undefined
    form.name = ''
  }
}, { immediate: true })


const rules: FormRules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' }
  ]
}

// 监听props变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

// 监听visible变化
watch(visible, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    // 关闭时重置表单
    resetForm()
  }
})

const resetForm = () => {
  form.id = undefined
  form.name = ''
  formRef.value?.clearValidate()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  const valid = await formRef.value.validate()
  if (!valid) return
  loading.value = true
    console.log('编辑标签 form:', form)
  try {
    if(form.id){
      emit('editTag', { ...form })
    }else{
       emit('addTag', { ...form })
    }
   
    visible.value = false
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>