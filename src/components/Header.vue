<template>
  <nav class="header-nav">
    <router-link to="/">主页</router-link>
    <router-link v-if="user" to="/record">我的记录</router-link>
    <router-link v-if="!user" to="/login">登录</router-link>
    <router-link v-if="user" to="/logout">登出</router-link>
  </nav>
</template>

<script>
import { auth } from "@/firebase"; // 确保路径正确
import { onAuthStateChanged } from "firebase/auth";
import { ref, onUnmounted } from "vue";

export default {
  name: "Header",
  setup() {
    const user = ref(null);
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      user.value = u;
    });

    onUnmounted(() => {
      unsubscribe();
    });

    return { user };
  },
};
</script>

<style>
.header-nav {
  /* 添加您的样式 */
  padding: 10px;
  background-color: transparent;
  text-align: center;
}

.header-nav a {
  margin: 0 10px;
}
</style>
