<template>
    <div class="user-card" @click="viewUser">
      <img :src="user.image" alt="User Image">
      <h3>{{ user.name }}</h3>
      <!-- 其他用户信息 -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      user: Object
    },
    methods: {
      viewUser() {
        // 实现查看用户功能
      }
    }
  };
  </script>
  
  <style scoped>
  .user-card {
  }
  </style>
  