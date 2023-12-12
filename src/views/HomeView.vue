<template>
  <div class="hue"></div>
  <div class="container">
      <div class="header">
        <!-- Logo -->
        <img :src="require('@/assets/logo.png')" alt="JODO Logo" class="logo" />
        <!-- 名称 -->
        <h1 class="title">JODO</h1>
      </div>
      <!-- 中文文案 -->
      <p class="description">简化您的日常，发掘更好的自己</p>
      <!-- 英文文案 -->
      <p class="description">Simplify Your Daily Life, Discover a Better You</p>
      <!-- 按钮 -->
      <button class="start-button" @click="navigateToRecord">开始使用</button>
    </div>
</template>

<script>
export default {
  name: "HomeView",
  methods: {
    navigateToRecord() {
      this.$router.push('/record');
    }
  }
};
</script>


<style scoped>
@keyframes hueRotate {
  0% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(60deg);
  }
  100% {
    filter: hue-rotate(0deg);
  }
}
.hue {
  position: fixed; /* 改为fixed以覆盖整个屏幕而不影响其他内容 */
  left: 0;
  top: 62px;
  width: 100vw;
  height: 100vh;
  opacity: 1;
  background: linear-gradient(-45deg, #f5f5f5,#97edc6, #1ac5c5);
  animation: hueRotate 5s infinite linear;
  z-index: -1; /* 设置为负值以确保它位于内容之下 */
}

.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}


.header {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
}

.logo {
  height: 100px; /* 或其他尺寸 */
  margin-bottom: 20px;
}

.title {
  margin-bottom: 10px;
  font-size: 2.5em;
  color: #333; /* 或您喜欢的颜色 */
  margin-left: 10px;
}

.description {
  margin-bottom: 20px;
  font-size: 1.2em;
  color: #666; /* 或您喜欢的颜色 */
}

.start-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
}

.start-button:hover {
  background-color: #367b62; /* 鼠标悬停时的颜色 */
}

</style>