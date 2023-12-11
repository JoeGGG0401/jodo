<template>
  <div class="my-space">
    <h1>我的空间</h1>

    <div class="stats-section">
      <h2>我的状态</h2>
      <StatCard title="本周工作时间" :value="workTime" />
      <StatCard title="本周休息时间" :value="restTime" />
      <StatCard title="本周睡眠时间" :value="sleepTime" />
    </div>

    <div class="users-section">
      <h2>我的关注</h2>
      <template v-if="observedUsers.length > 0">
        <UserCard v-for="user in observedUsers" :key="user.id" :user="user" />
      </template>
      <p v-else>这里空空如也哦</p>
    </div>
  </div>
</template>

<script>
import StatCard from "../components/StatCard.vue";
import UserCard from "../components/UserCard.vue";

export default {
  components: {
    StatCard,
    UserCard,
  },
  data() {
    return {
      // 示例数据，你应该从后端或数据库获取真实数据
      workTime: "40小时",
      restTime: "15小时",
      sleepTime: "56小时",
      observedUsers: [
        // ...用户数据
      ],
    };
  },
};
</script>

<style>
.my-space h2 {
  margin-top: 20px;
  color: #333;
}

.users-section p {
  color: #666;
}
</style>
