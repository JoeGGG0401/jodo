<template>
  <nav class="header-nav">
    <!-- Logo -->
    <router-link to="/" class="logo">
      <img :src="require('@/assets/logo.png')" alt="JODO Logo" />
    </router-link>

    <!-- 搜索框 -->
    <div class="search-container" v-if="user">
      <input type="text" placeholder="搜索用户..." v-model="searchText" />
      <button @click="search">🔍</button>
    </div>

    <!-- 导航链接 -->
    <div class="nav-links">
      <router-link v-if="user" to="/myspace">我的空间</router-link>
      <router-link v-if="user" to="/record">我的记录</router-link>
      <router-link to="/about">开发文档</router-link>
      <router-link v-if="!user" to="/login">登录</router-link>
      <router-link v-if="user" to="/logout">登出</router-link>
    </div>
  </nav>
</template>

<script>
import { auth } from "@/firebase"; // 确保路径正确
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "Header",
  data() {
    return {
      searchText: "",
      searchResults: [],
      user: null,
    };
  },
  created() {
    this.unsubscribe = onAuthStateChanged(auth, (u) => {
      this.user = u;
    });
  },
  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    search() {
      if (this.searchText) {
        this.$router.push({
          name: "search",
          params: { query: this.searchText },
        });
      }
    },
  },
};
</script>

<style>
.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: transparent;
}

.logo img {
  height: 36px; /* 根据需要调整 */
}

.search-container {
  display: flex;
  align-items: center; /* 确保子元素在垂直方向上居中 */
  height: 36px; /* 设置容器的固定高度 */
}

.search-container input {
  padding: 0px 10px;
  margin-right: 5px; /* 为按钮留出空间 */
  height: 100%; /* 使输入框填充容器高度 */
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* 包括边框和内边距在内的总高度 */
}

.search-container button {
  padding: 0px 10px;
  height: 100%; /* 使按钮填充容器高度 */
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  box-sizing: border-box; /* 包括边框和内边距在内的总高度 */
  margin: 1px;
}

.nav-links {
  /* 添加所需样式 */
}

.nav-links a {
  margin: 0 10px;
}
</style>
