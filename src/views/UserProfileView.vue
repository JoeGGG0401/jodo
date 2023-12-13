<template>
  <div class="user-profile">
    <h1>用户资料</h1>
    <img :src="user.photoURL || defaultAvatar" alt="头像" class="avatar" />
    <form @submit.prevent="saveProfile">
      <div class="form-group">
        <label for="name">姓名:</label>
        <input id="name" v-model="user.name" />
      </div>
      <div class="form-group">
        <label for="avatar">头像URL:</label>
        <input id="avatar" v-model="user.photoURL" />
      </div>
      <button type="submit">保存</button>
    </form>
  </div>
</template>

<script>
import { auth, db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      user: {
        name: "", // 用户姓名
        email: "", // 用户电子邮件
        photoURL: "", // 用户头像URL
      },
      defaultAvatar: "path/to/default/avatar.png", // 默认头像路径
      originalUser: {
        // 初始化 originalUser
        name: "",
        photoURL: "",
      },
    };
  },
  created() {
    this.loadUserProfile(); // 加载用户资料
  },
  methods: {
    async loadUserProfile() {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          this.user = userSnap.data();
        } else {
          console.error("用户信息未找到");
        }
      }
    },
    async saveProfile() {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const updatedData = {};

        // 检查每个字段是否有变化，并添加到更新对象中
        if (this.user.name !== this.originalUser.name) {
          updatedData.name = this.user.name;
        }
        if (this.user.photoURL !== this.originalUser.photoURL) {
          updatedData.photoURL = this.user.photoURL;
        }

        if (Object.keys(updatedData).length > 0) {
          try {
            await updateDoc(userRef, updatedData);
            alert("资料已更新");
            // 更新 originalUser 以反映新的资料
            this.originalUser = Object.assign({}, this.user);
          } catch (error) {
            console.error("更新失败:", error);
          }
        } else {
          alert("没有变更");
        }
      }
    },
  },
};
</script>

<style>
.user-profile {
  max-width: 500px; /* 最大宽度 */
  margin: 0 auto; /* 水平居中 */
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 简单的阴影效果 */
  border-radius: 10px; /* 轻微的圆角 */
  background-color: #fff; /* 背景色 */
}

.avatar {
  width: 150px; /* 调整尺寸 */
  height: 150px;
  border-radius: 50%;
  border: 2px solid #42b983; /* 添加边框 */
  object-fit: cover; /* 确保图片不失真 */
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button[type="submit"] {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

button[type="submit"]:hover {
  background-color: #367b62; /* 鼠标悬停时的颜色 */
}
</style>
