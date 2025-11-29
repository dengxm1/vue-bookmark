<template>
  <el-dialog
    v-model="visible"
    :title="`${form.id?'编辑':'添加'}书签`"
    width="500px"
    :before-close="handleClose"
    :append-to-body="true"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="网址" prop="url">
        <el-input
          maxlength="50"
          v-model="form.url"
          placeholder="请输入网址，例如：https://example.com"
          :prefix-icon="Link"
          @blur="handleUrlBlur"
        />
      </el-form-item>
      
      <el-form-item label="标题" prop="title">
        <el-input
          maxlength="30"
          v-model="form.title"
          placeholder="网页标题"
          :prefix-icon="Document"
        />
      </el-form-item>
      
      <el-form-item label="标签">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="选择或输入标签"
          style="width: 100%"
        >
          <el-option
            v-for="tag in availableTags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="备注">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="可选备注信息"
          maxlength="200"
          show-word-limit
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules} from 'element-plus'
import { Link, Document } from '@element-plus/icons-vue'
import type { Tag } from '@/types'

interface FormData {
  id:number|null,
  url: string
  title: string
  tags: number[]
  description: string
}

interface Emits {
  (e: 'submit', data: FormData): void
  (e: 'update:modelValue', value: boolean): void
}

interface Props {
  modelValue: boolean
  availableTags: Tag[],
  initData?:FormData
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = ref(props.modelValue)
const loading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive<FormData>({
  id:null,
  url: '',
  title: '',
  tags: [],
  description: ''
})

watch(()=> props.initData, (val) => {
  if (val) {
    form.id = val.id
    form.url = val.url
    form.title = val.title
    form.tags = val.tags
    form.description = val.description
  }
  console.log('form form:', form)
}, {immediate: true})

const rules: FormRules = {
  url: [
    { required: true, message: '请输入网址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的网址', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
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
    console.log('关闭时重置表单')
    resetForm()
  }
})

const resetForm = () => {
  form.id = null
  form.url = ''
  form.title = ''
  form.tags = []
  form.description = ''
  formRef.value?.clearValidate()
}

const handleUrlBlur = async () => {
  if (!form.url) return
  
  // 这里可以调用后端API自动获取网页标题
  // 模拟获取标题
  if (form.url && !form.title) {
    loading.value = true
    try {
      form.title = new URL(form.url).hostname
      // 模拟网络请求
      // await new Promise(resolve => setTimeout(resolve, 500))
      // form.title = `获取的网页标题 - ${new URL(form.url).hostname}`
    } finally {
      loading.value = false
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  const valid = await formRef.value.validate()
  if (!valid) return
  
  loading.value = true
  try {
    emit('submit', { ...form })
    visible.value = false
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  visible.value = false
}

onMounted(() => {
  console.log('AddBookmarkDialog 组件已挂载')
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>