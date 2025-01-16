<template>
  <div class="order">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>订单详情</h2>
        </div>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单号">{{ orderId }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">腾讯视频会员月卡</el-descriptions-item>
        <el-descriptions-item label="购买数量">1</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥25.00</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag type="success">已完成</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="卡密信息">
          <el-input type="textarea" v-model="cardInfo" :rows="3" readonly />
        </el-descriptions-item>
      </el-descriptions>

      <div class="actions">
        <el-button type="primary" @click="copyCardInfo">复制卡密</el-button>
        <el-button @click="goBack">返回首页</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id
const cardInfo = ref('TENCENT-VIP-2024-XXXX-XXXX-XXXX')

const copyCardInfo = () => {
  navigator.clipboard.writeText(cardInfo.value)
    .then(() => {
      ElMessage.success('卡密已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.order {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style> 