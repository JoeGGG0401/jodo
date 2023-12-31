<template>
  <div class="my-space">
    <h1>我的空间</h1>

    <div class="stats-section">
      <StatCard title="本周工作时间" :value="workTime" />
      <StatCard title="本周休息时间" :value="restTime" />
      <StatCard title="本周睡眠时间" :value="sleepTime" />

      <div v-if="barChartOption" class="chart-container">
        <EChartsComponent :option="barChartOption" />
      </div>
      <div v-if="lineChartOption" class="chart-container">
        <EChartsComponent :option="lineChartOption" />
      </div>
      <div v-if="pieChartOption" class="chart-container">
        <EChartsComponent :option="pieChartOption" />
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
      lineChartOption: null,
      pieChartOption: null,

      observedUsers: [],
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      const statsData = await LogService.getUserStatsForLastWeek(user.uid);
      if (statsData && statsData.length > 0) {
        this.barChartOption = this.generateBarChartOption(statsData);
        this.lineChartOption = this.generateLineChartOption(statsData);
        this.pieChartOption = this.generatePieChartOption(statsData);

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
    generateLineChartOption(statsData) {
      const dates = statsData.map(data => data.date);
      const workHours = statsData.map(data => data.work || 0);
      const restHours = statsData.map(data => data.rest || 0);
      const sleepHours = statsData.map(data => data.sleep || 0);

      return {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['工作', '休息', '睡眠']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '工作',
            type: 'line',
            data: workHours
          },
          {
            name: '休息',
            type: 'line',
            data: restHours
          },
          {
            name: '睡眠',
            type: 'line',
            data: sleepHours
          }
        ]
      };
    },
    generatePieChartOption(statsData) {
      const totalWork = statsData.reduce((sum, data) => sum + (data.work || 0), 0);
      const totalRest = statsData.reduce((sum, data) => sum + (data.rest || 0), 0);
      const totalSleep = statsData.reduce((sum, data) => sum + (data.sleep || 0), 0);

      return {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '活动时间',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: totalWork, name: '工作' },
              { value: totalRest, name: '休息' },
              { value: totalSleep, name: '睡眠' }
            ]
          }
        ]
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
.my-space {
  max-width: 1200px; /* 最大宽度 */
  margin: auto; /* 居中 */
  padding: 20px; /* 内边距 */
}

.stats-section, .users-section {
  margin-bottom: 30px; /* 分区间隔 */
  background-color: #f5f5f5; /* 背景色 */
  padding: 20px; /* 内边距 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 阴影 */
}

.chart-container {
  margin-bottom: 20px; /* 图表间隔 */
}

h1, h2 {
  color: #333; /* 标题颜色 */
}

@media (min-width: 600px) {
  .stats-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .stat-card {
    flex-basis: 30%; /* 卡片宽度 */
    min-width: 250px; /* 最小宽度 */
    margin-bottom: 20px; /* 间隔 */
  }
}

.users-section p {
  color: #666; /* 文本颜色 */
}


.chart-container {
  width: 50%;
  height: 400px;
}

.users-section p {
  color: #666;
}
</style>
