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

    <!-- 用户菜单 -->
    <div class="user-menu">
      <div class="nav-links">
        <router-link v-if="!user" to="/about">开发文档</router-link>
        <button v-if="user" @click="toggleMenu">
          <img v-if="userData && userData.photoURL" :src="userData.photoURL" alt="头像" class="user-avatar">
          <span v-else>{{ getInitial(userData?.name || user.email) }}</span>

        </button>
        <router-link v-else to="/login">登录</router-link>

        <div v-if="menuVisible" class="dropdown-menu">
          <router-link to="/myspace">我的空间</router-link>
          <router-link to="/record">我的记录</router-link>
          <router-link to="/event-form">添加记录</router-link>
          <router-link to="/user-profile">我的名片</router-link>
          <router-link to="/about">开发文档</router-link>
          <router-link to="/logout">登出</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default {
  name: "Header",
  data() {
    return {
      searchText: "",
      searchResults: [],
      user: null,
      menuVisible: false,
      userData: null, // 用于存储用户表中的数据
    };
  },
  created() {
    this.unsubscribe = onAuthStateChanged(auth, async (u) => {
      this.user = u;
      this.menuVisible = false;
      if (u) {
        const userRef = doc(db, "users", u.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          this.userData = userSnap.data();
        } else {
          console.error("用户信息未找到");
        }
      } else {
        this.userData = null; // 清除用户数据
      }
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
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    getInitial(name) {
      return name ? name.charAt(0).toUpperCase() : '';
    }
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
  display: flex;
  align-items: center; /* 确保子元素在垂直方向上居中 */
  height: 36px; /* 设置容器的固定高度 */
}

.nav-links a {
  margin: 0 10px;
}

.nav-links button {
  margin: 0 10px;
}


.user-menu {
  position: relative;
}

.nav-links button {
  background: none;
  border: none;
  padding: 5px 10px;
  font-size: 16px; /* 调整为合适的字体大小 */
  cursor: pointer;
}

.user-menu button:hover {
  text-decoration: none;
  color: #42b983;
}

.dropdown-menu {
  position: absolute;
  top: 100%;  /* 位于触发元素的正下方 */
  right: 0;   /* 对齐到右侧 */
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100; /* 确保这个值高于其他元素的 z-index */
  width: auto; /* 或者指定一个最小宽度，例如 min-width: 200px; */
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); /* 可选：添加阴影效果 */
}

.dropdown-menu a {
  margin-bottom: 10px;
  white-space: nowrap; /* 确保链接文本不会换行 */
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.user-menu button span {
  display: inline-block;
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 50%;
  background-color: #42b983; /* 可以根据你的设计调整背景色 */
  color: white;
  text-align: center;
}

</style>
