<template>
    <div class="logout-container">
      <h1>退出登录</h1>
      <button @click="signOut">退出登录</button>
    </div>
  </template>
  
  <script>
  import { auth } from '@/firebase'; // 确保路径正确
  import { signOut } from 'firebase/auth';
  
  export default {
    name: 'LogoutView',
    methods: {
      signOut() {
        signOut(auth)
          .then(() => {
            // 退出成功，可以重定向到登录页面或显示消息
            console.log('已成功退出登录');
            this.$router.push('/'); // 重定向到登录页面
          })
          .catch((error) => {
            // 处理错误
            console.error('退出登录失败', error);
          });
      }
    }
  }
  </script>
  
  <style>
  .logout-container {
    max-width: 300px;
    margin: auto;
    padding: 20px;
    text-align: center;
  }
  
  button {
    padding: 10px 20px;
    margin-top: 20px;
  }
  </style>
  