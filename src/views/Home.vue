<template>
  <div class="home">
    <div class="container">
      <!-- 移动端菜单按钮 -->
      <el-button
        class="mobile-menu-button"
        @click="showMobileMenu = true"
        text
      >
        <el-icon><Menu /></el-icon>
        分类
      </el-button>

      <!-- 左侧分类 - PC端 -->
      <div class="sidebar" v-if="!isMobile">
        <div class="sidebar-header">
          <h3>商品分类</h3>
        </div>
        <el-menu>
          <el-menu-item index="1" @click="handleMenuClick">
            <el-icon><Monitor /></el-icon>
            <span>游戏点卡</span>
          </el-menu-item>
          <el-menu-item index="2" @click="handleMenuClick">
            <el-icon><Iphone /></el-icon>
            <span>话费充值</span>
          </el-menu-item>
          <el-menu-item index="3" @click="handleMenuClick">
            <el-icon><VideoCamera /></el-icon>
            <span>视频会员</span>
          </el-menu-item>
          <el-menu-item index="4" @click="handleMenuClick">
            <el-icon><Headset /></el-icon>
            <span>音乐服务</span>
          </el-menu-item>
          <el-menu-item index="5" @click="handleMenuClick">
            <el-icon><Present /></el-icon>
            <span>礼品卡券</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 左侧分类 - 移动端抽屉 -->
      <el-drawer
        v-model="showMobileMenu"
        title="商品分类"
        direction="ltr"
        size="75%"
        :with-header="false"
        class="category-drawer"
      >
        <div class="drawer-content">
          <div class="drawer-header">
            <h3>商品分类</h3>
            <el-button 
              @click="showMobileMenu = false"
              text
              class="close-button"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <el-menu>
            <el-menu-item index="1" @click="handleMenuClick">
              <el-icon><Monitor /></el-icon>
              <span>游戏点卡</span>
            </el-menu-item>
            <el-menu-item index="2" @click="handleMenuClick">
              <el-icon><Iphone /></el-icon>
              <span>话费充值</span>
            </el-menu-item>
            <el-menu-item index="3" @click="handleMenuClick">
              <el-icon><VideoCamera /></el-icon>
              <span>视频会员</span>
            </el-menu-item>
            <el-menu-item index="4" @click="handleMenuClick">
              <el-icon><Headset /></el-icon>
              <span>音乐服务</span>
            </el-menu-item>
            <el-menu-item index="5" @click="handleMenuClick">
              <el-icon><Present /></el-icon>
              <span>礼品卡券</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-drawer>

      <!-- 右侧商品列表 -->
      <div class="content">
        <div class="filter-bar">
          <div class="title">全部商品</div>
          <div class="filters">
            <el-button text :class="{ active: sortBy === 'default' }" @click="sortBy = 'default'">默认</el-button>
            <el-button text :class="{ active: sortBy === 'price' }" @click="sortBy = 'price'">价格</el-button>
            <el-button text :class="{ active: sortBy === 'sales' }" @click="sortBy = 'sales'">销量</el-button>
          </div>
        </div>

        <el-row :gutter="10">
          <el-col 
            :xs="12" 
            :sm="12" 
            :md="8" 
            :lg="6" 
            v-for="card in sortedCards" 
            :key="card.id"
          >
            <el-card class="card-item" :body-style="{ padding: '0px' }">
              <div class="card-tag" v-if="card.tag">{{ card.tag }}</div>
              <img :src="card.image" class="card-image">
              <div class="card-content">
                <h3>{{ card.name }}</h3>
                <p class="description">{{ card.description }}</p>
                <div class="card-info">
                  <div class="stock-sales">
                    <span class="stock">库存: {{ card.stock }}</span>
                    <span class="sales">月销 {{ card.sales }}</span>
                  </div>
                  <div class="card-footer">
                    <div class="price-container">
                      <span class="currency">¥</span>
                      <span class="price">{{ card.price }}</span>
                      <span class="original-price" v-if="card.originalPrice">¥{{ card.originalPrice }}</span>
                    </div>
                    <el-button 
                      class="buy-button" 
                      :class="{ 'disabled': card.stock <= 0 }"
                      type="primary" 
                      size="small" 
                      @click="handleBuy(card)" 
                      :disabled="card.stock <= 0"
                    >
                      <el-icon><ShoppingCart /></el-icon>
                      {{ card.stock <= 0 ? '已售罄' : '立即购买' }}
                    </el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100"
            :current-page="currentPage"
            @current-change="handlePageChange"
            :page-size="8"
          />
        </div>
      </div>
    </div>

    <!-- 购买对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isMobile ? '确认订单' : ''" 
      width="90%" 
      :fullscreen="isMobile"
      class="order-dialog"
    >
      <div class="order-header" v-if="!isMobile">
        <div class="step-header">
          <h2>确认订单信息</h2>
          <p class="step-desc">请核对商品信息并填写联系方式</p>
        </div>
      </div>

      <div class="order-content">
        <!-- 商品信息卡片 -->
        <div class="product-card">
          <img :src="selectedCard && selectedCard.image" class="product-image">
          <div class="product-info">
            <h3>{{ selectedCard && selectedCard.name }}</h3>
            <p class="product-desc">{{ selectedCard && selectedCard.description }}</p>
            <div class="price-info">
              <span class="current-price">¥{{ selectedCard && selectedCard.price }}</span>
              <span class="original-price" v-if="selectedCard && selectedCard.originalPrice">
                ¥{{ selectedCard.originalPrice }}
              </span>
            </div>
          </div>
        </div>

        <!-- 订单表单 -->
        <el-form 
          :model="orderForm" 
          label-width="80px"
          class="order-form"
        >
          <el-form-item label="购买数量">
            <el-input-number 
              v-model="orderForm.quantity" 
              :min="1" 
              :max="selectedCard ? selectedCard.stock : 1"
              :precision="0"
              :step="1"
              size="large"
              class="quantity-input"
            />
            <span class="stock-info">库存: {{ selectedCard && selectedCard.stock }}件</span>
          </el-form-item>

          <el-form-item label="联系邮箱" required>
            <el-input 
              v-model="orderForm.email" 
              placeholder="请输入接收卡密的邮箱"
              size="large"
              class="email-input"
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>

        <!-- 订单总结 -->
        <div class="order-summary">
          <div class="summary-item">
            <span>商品总价</span>
            <span class="total-price">¥{{ totalPrice }}</span>
          </div>
          <div class="summary-item">
            <span>优惠金额</span>
            <span class="discount-price">-¥{{ discountAmount }}</span>
          </div>
          <div class="divider"></div>
          <div class="summary-item final">
            <span>应付金额</span>
            <span class="final-price">¥{{ finalPrice }}</span>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <template #footer>
        <div class="dialog-footer">
          <div class="price-summary" v-if="!isMobile">
            <span class="label">实付金额：</span>
            <span class="amount">¥{{ finalPrice }}</span>
          </div>
          <div class="actions">
            <el-button @click="dialogVisible = false" plain>取消订单</el-button>
            <el-button type="primary" @click="submitOrder" class="submit-btn">
              立即支付
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 移动端遮罩层 -->
    <div v-if="showMobileMenu" class="mobile-overlay" @click="showMobileMenu = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Monitor, 
  Iphone, 
  VideoCamera, 
  Headset, 
  Present, 
  Menu, 
  Close,
  ShoppingCart,
  Message 
} from '@element-plus/icons-vue'

const showMobileMenu = ref(false)
const isMobile = computed(() => window.innerWidth <= 768)

const handleMenuClick = () => {
  if (isMobile.value) {
    showMobileMenu.value = false
  }
}

const currentPage = ref(1)
const sortBy = ref('default')

const cards = ref([
  {
    id: 1,
    name: '腾讯视频会员12个月',
    price: 218,
    originalPrice: 298,
    description: '年卡特惠，限时优惠',
    stock: 100,
    sales: 1000,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
    tag: '热销'
  },
  {
    id: 2,
    name: '王者荣耀648点券',
    price: 648,
    originalPrice: 648,
    description: '钻石直充，秒到账',
    stock: 50,
    sales: 800,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80',
    tag: '推荐'
  },
  {
    id: 3,
    name: '移动话费充值100元',
    price: 98,
    originalPrice: 100,
    description: '全国通用，快速充值',
    stock: 200,
    sales: 1200,
    image: 'https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=600&q=80',
    tag: '优惠'
  },
  {
    id: 4,
    name: '网易云音乐黑胶会员',
    price: 128,
    originalPrice: 168,
    description: '年卡特惠，享受音乐',
    stock: 150,
    sales: 900,
    image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=600&q=80',
    tag: '新品'
  }
])

const sortedCards = computed(() => {
  const list = [...cards.value]
  if (sortBy.value === 'price') {
    return list.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'sales') {
    return list.sort((a, b) => b.sales - a.sales)
  }
  return list
})

const dialogVisible = ref(false)
const selectedCard = ref(null)
const orderForm = ref({
  quantity: 1,
  email: ''
})

const totalPrice = computed(() => {
  return selectedCard.value ? selectedCard.value.price * orderForm.value.quantity : 0
})

const discountAmount = computed(() => {
  if (!selectedCard.value || !selectedCard.value.originalPrice) return 0
  return (selectedCard.value.originalPrice - selectedCard.value.price) * orderForm.value.quantity
})

const finalPrice = computed(() => {
  return totalPrice.value
})

const handleBuy = (card) => {
  selectedCard.value = card
  orderForm.value = {
    quantity: 1,
    email: ''
  }
  dialogVisible.value = true
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const submitOrder = () => {
  if (!orderForm.value.email) {
    ElMessage.error('请输入邮箱地址')
    return
  }
  
  ElMessage.success('订单提交成功！卡密将发送到您的邮箱')
  dialogVisible.value = false
  
  const card = cards.value.find(c => c.id === selectedCard.value.id)
  if (card) {
    card.stock -= orderForm.value.quantity
  }
}
</script>

<style scoped>
.home {
  padding: 10px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  position: relative;
}

.mobile-menu-button {
  display: none;
}

.sidebar {
  width: 200px;
  background: white;
  border-radius: 4px;
  padding: 20px 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
}

.close-button {
  display: none;
}

.content {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.filter-bar {
  background: white;
  padding: 15px 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.filters {
  display: flex;
  gap: 20px;
}

.filters .active {
  color: #409EFF;
}

.card-item {
  margin-bottom: 15px;
  transition: all 0.3s;
  position: relative;
  border: none;
  border-radius: 8px;
  overflow: hidden;
}

.card-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(244, 67, 54, 0.9);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1;
}

.card-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 0.3s;
  filter: brightness(1.02) contrast(1.05);
}

.card-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.card-item:hover .card-image {
  transform: scale(1.05);
  filter: brightness(1.05) contrast(1.08);
}

.card-content {
  padding: 12px;
  background: white;
}

.card-content h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stock-sales {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.price-container {
  display: flex;
  align-items: baseline;
}

.currency {
  color: #f56c6c;
  font-size: 14px;
  margin-right: 2px;
}

.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}

.original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 8px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.buy-button {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 12px rgba(58, 123, 213, 0.2);
  color: white;
  font-weight: 500;
}

.buy-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 15px rgba(58, 123, 213, 0.3);
  background: linear-gradient(135deg, #3a7bd5, #2cc1ed);
}

.buy-button:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 8px rgba(58, 123, 213, 0.2);
}

.buy-button.disabled {
  background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
  color: #999;
  box-shadow: none;
  cursor: not-allowed;
}

.buy-button.disabled:hover {
  transform: none;
  box-shadow: none;
}

.buy-button .el-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.buy-button:hover .el-icon {
  transform: translateX(2px);
}

@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 10px;
  }

  .mobile-menu-button {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .mobile-menu-button .el-icon {
    margin-right: 4px;
    font-size: 18px;
  }

  .sidebar {
    display: none;
    width: 75%;
    max-width: 280px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    border-radius: 0;
    background: white;
    box-shadow: 2px 0 8px rgba(0,0,0,0.15);
    padding: 0;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar.mobile-sidebar {
    display: block;
    transform: translateX(0);
  }

  .sidebar-header {
    padding: 16px;
    background: linear-gradient(135deg, #f6f8fd, #f0f4ff);
    border-bottom: 1px solid #eee;
  }

  .sidebar-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }

  .close-button {
    display: block;
    position: absolute;
    right: 12px;
    top: 12px;
    padding: 8px;
  }

  .close-button .el-icon {
    font-size: 20px;
  }

  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
    backdrop-filter: blur(2px);
    transition: opacity 0.3s;
  }

  .el-menu {
    border-right: none;
  }

  .el-menu-item {
    height: 50px;
    line-height: 50px;
    font-size: 15px;
  }

  .el-menu-item .el-icon {
    font-size: 18px;
  }

  .filter-bar {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }

  .card-item {
    margin-bottom: 8px;
  }

  .card-image {
    height: 100px;
  }

  .card-content {
    padding: 6px;
  }

  .card-content h3 {
    font-size: 13px;
    margin-bottom: 3px;
  }

  .description {
    font-size: 11px;
    margin-bottom: 3px;
  }

  .price {
    font-size: 13px;
  }

  .el-button--small {
    padding: 4px 8px;
    font-size: 11px;
    min-height: 24px;
  }

  .card-footer {
    flex-direction: column;
    gap: 4px;
    align-items: stretch;
  }

  .pagination {
    margin-top: 10px;
  }

  .buy-button {
    width: 100%;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 13px;
  }

  .buy-button .el-icon {
    font-size: 14px;
  }
}

@media screen and (max-width: 480px) {
  .home {
    padding: 5px;
  }

  .card-image {
    height: 90px;
  }

  .card-content {
    padding: 4px;
  }

  .card-content h3 {
    font-size: 12px;
    margin-bottom: 2px;
  }

  .description {
    font-size: 10px;
    margin-bottom: 2px;
  }

  .price {
    font-size: 12px;
  }

  .el-button--small {
    padding: 2px 6px;
    font-size: 10px;
  }

  .filter-bar {
    padding: 8px;
  }

  .el-pagination {
    font-size: 12px;
  }

  .buy-button {
    padding: 4px 10px;
    border-radius: 14px;
    font-size: 12px;
  }

  .buy-button .el-icon {
    font-size: 12px;
  }
}

.order-dialog :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

.order-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.order-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.order-header {
  padding: 24px;
  background: linear-gradient(135deg, #f6f8fd, #f0f4ff);
}

.step-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.step-desc {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
}

.order-content {
  padding: 24px;
}

.product-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 24px;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #333;
}

.product-desc {
  margin: 0 0 8px;
  font-size: 14px;
  color: #666;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.order-form {
  margin-bottom: 24px;
}

.quantity-input {
  width: 160px;
}

.stock-info {
  margin-left: 12px;
  color: #999;
  font-size: 14px;
}

.email-input {
  width: 100%;
}

.order-summary {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.summary-item.final {
  margin-bottom: 0;
  font-size: 16px;
  color: #333;
}

.total-price {
  color: #333;
}

.discount-price {
  color: #f56c6c;
}

.final-price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 12px 0;
}

.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-summary {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-summary .label {
  font-size: 14px;
  color: #666;
}

.price-summary .amount {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
}

.actions {
  display: flex;
  gap: 12px;
}

.submit-btn {
  min-width: 120px;
}

@media screen and (max-width: 768px) {
  .order-content {
    padding: 16px;
  }

  .product-card {
    padding: 12px;
  }

  .product-image {
    width: 80px;
    height: 80px;
  }

  .dialog-footer {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
  }

  .submit-btn {
    width: 100%;
  }
}

.category-drawer :deep(.el-drawer) {
  background: linear-gradient(to bottom, #f6f8fd, #ffffff);
}

.category-drawer :deep(.el-drawer__body) {
  padding: 0;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f6f8fd, #f0f4ff);
  border-bottom: 1px solid #eee;
}

.drawer-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.close-button {
  padding: 8px;
}

.close-button .el-icon {
  font-size: 20px;
}

.category-drawer :deep(.el-menu) {
  border-right: none;
  flex: 1;
}

.category-drawer :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
}

.category-drawer :deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
}

.category-drawer :deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
}

.category-drawer :deep(.el-menu-item .el-icon) {
  font-size: 18px;
  margin-right: 12px;
}

/* Remove old mobile sidebar styles */
.sidebar.mobile-sidebar {
  display: none;
}

.mobile-overlay {
  display: none;
}
</style> 