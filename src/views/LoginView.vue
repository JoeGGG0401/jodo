<template>
  <div class="login-container">
    <h1>登录</h1>
    <button @click="signInWithGoogle">使用 Gmail 登录</button>
  </div>
</template>

<script>
import { auth } from "../firebase"; // 确保路径正确
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default {
  name: "LoginView",
  methods: {
    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // 处理登录成功
          console.log("登录成功", result.user);
          this.$router.push("/record");
        })
        .catch((error) => {
          // 处理登录失败
          console.error("登录失败", error);
        });
    },
  },
};
</script>

<style>
.login-container {
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
