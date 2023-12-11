<template>
  <div class="login-container">
    <h1>登录</h1>
    <button @click="signInWithGoogle">使用 Gmail 登录</button>
  </div>
</template>

<script>
import { auth, db } from "../firebase"; // 确保路径正确
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default {
  name: "LoginView",
  methods: {
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // 检查用户是否已在用户表中
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          // 如果用户不存在，则创建一个新用户记录
          await setDoc(userDocRef, { email: user.email, name: user.displayName });
        }

        this.$router.push("/record");
      } catch (error) {
        console.error("登录失败", error);
      }
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
