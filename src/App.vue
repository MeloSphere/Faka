<template>
  <el-container>
    <el-header>
      <div class="header-content">
        <div class="left">
          <div class="logo">logo</div>
          <el-input
            v-model="searchText"
            placeholder="搜索商品"
            prefix-icon="el-icon-search"
            class="search-input"
          />
        </div>
        <div class="right">
          <el-button text @click="$router.push('/')">
            <el-icon><House /></el-icon>
            <span class="button-text">首页</span>
          </el-button>
          <el-button text>
            <el-icon><ShoppingCart /></el-icon>
            <span class="button-text">购物车</span>
          </el-button>
          <el-button text>
            <el-icon><User /></el-icon>
            <span class="button-text">我的</span>
          </el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { House, ShoppingCart, User } from '@element-plus/icons-vue'

const searchText = ref('')
</script>

<style>
.el-container {
  min-height: 100vh;
}

.el-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: auto !important;
  min-height: 64px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.logo {
  font-size: 24px;
  color: #409EFF;
  font-weight: bold;
  white-space: nowrap;
}

.search-input {
  width: 300px;
}

.right {
  display: flex;
  gap: 10px;
}

.el-main {
  margin-top: 64px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
  padding: 10px;
}

.el-button [class*='el-icon'] + span {
  margin-left: 5px;
}

@media screen and (max-width: 768px) {
  .header-content {
    padding: 10px;
  }

  .search-input {
    width: 100%;
    min-width: 200px;
  }

  .left {
    width: 100%;
    justify-content: space-between;
  }

  .right {
    width: 100%;
    justify-content: space-around;
  }

  .button-text {
    font-size: 12px;
  }

  .el-main {
    padding: 10px;
  }
}

@media screen and (max-width: 480px) {
  .header-content {
    padding: 5px;
  }
}
</style> 