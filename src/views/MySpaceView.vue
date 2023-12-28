<template>
  <div class="my-space">
    <h1>我的空间</h1>

    <div class="stats-section">
      <h2>我的状态</h2>
      <StatCard title="本周工作时间" :value="workTime" />
      <StatCard title="本周休息时间" :value="restTime" />
      <StatCard title="本周睡眠时间" :value="sleepTime" />

      <div v-if="barChartOption" class="chart-container">
        <EChartsComponent :option="barChartOption" />
      </div>
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
import EChartsComponent from "../components/EChartsComponent.vue";
import LogService from "../services/LogService";
import { auth } from "../firebase";

export default {
  components: {
    StatCard,
    UserCard,
    EChartsComponent,
  },
  data() {
    return {
      workTime: "0小时",
      restTime: "0小时",
      sleepTime: "0小时",
      barChartOption: null,
      observedUsers: [],
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      const statsData = await LogService.getUserStatsForLastWeek(user.uid);
      if (statsData && statsData.length > 0) {
        this.barChartOption = this.generateBarChartOption(statsData);
        this.calculateTotalTimes(statsData);
      }
    }
  },
  methods: {
    generateBarChartOption(statsData) {
      const dates = statsData.map(data => data.date);
      const workHours = statsData.map(data => data.work || 0);
      const restHours = statsData.map(data => data.rest || 0);
      const sleepHours = statsData.map(data => data.sleep || 0);

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['工作', '休息', '睡眠']
        },
        xAxis: {
          type: 'category',
          data: dates,
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '工作',
            data: workHours,
            type: 'bar',
          },
          {
            name: '休息',
            data: restHours,
            type: 'bar',
          },
          {
            name: '睡眠',
            data: sleepHours,
            type: 'bar',
          }
        ],
      };
    },
    calculateTotalTimes(statsData) {
      const totalWork = statsData.reduce((sum, data) => sum + (data.work || 0), 0);
      const totalRest = statsData.reduce((sum, data) => sum + (data.rest || 0), 0);
      const totalSleep = statsData.reduce((sum, data) => sum + (data.sleep || 0), 0);

      this.workTime = `${totalWork.toFixed(2)}小时`;
      this.restTime = `${totalRest.toFixed(2)}小时`;
      this.sleepTime = `${totalSleep.toFixed(2)}小时`;
    },
  },
};
</script>

<style>
.my-space h2 {
  margin-top: 20px;
  color: #333;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.users-section p {
  color: #666;
}
</style>
