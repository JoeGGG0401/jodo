<template>
  <div class="event-form-view">    
    <div class="form">
      <form @submit.prevent="addEvent">
        <select v-model="newEvent.class">
          <option value="work">工作</option>
          <option value="break">休息</option>
          <option value="sleep">睡眠</option>
        </select>

        <component
          :is="currentEventComponent"
          @submit="handleEventSubmit"
        ></component>
        <div v-show="submitSuccess" class="submit-success">记录添加成功!</div>
      </form>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import LogService from "../services/LogService";
import { auth } from "../firebase"; // 确保路径正确
import WorkEventComponent from "../components/events/WorkEvent.vue";
import RestEventComponent from "../components/events/RestEvent.vue";
import SleepEventComponent from "../components/events/SleepEvent.vue";

export default {
  data() {
    return {
      newEvent: {
        title: "",
        start: "",
        end: "",
        class: "work",
        contentFull: "",
      },
      submitSuccess: false,
    };
  },
  computed: {
    currentEventComponent() {
      switch (this.newEvent.class) {
        case "work":
          return WorkEventComponent;
        case "break":
          return RestEventComponent;
        case "sleep":
          return SleepEventComponent;
      }
    },
  },
  methods: {
    handleEventSubmit(eventData) {
      this.newEvent = { ...this.newEvent, ...eventData };
      this.addEvent(); // 调用添加事件的方法
    },

    async addEvent() {
      try {
        const user = auth.currentUser;
        if (user) {
          const formattedStart = this.formatDateTime(this.newEvent.start);
          const formattedEnd = this.formatDateTime(this.newEvent.end);

          const data = {
            title: this.newEvent.title,
            start: formattedStart,
            end: formattedEnd,
            class: this.newEvent.class,
            contentFull: this.newEvent.contentFull,
            content: "点击查看详情🔎",
          };

          await LogService.createLog(user.uid, data);
          console.info("Adding event Complete!");
          this.submitSuccess = true; // 设置成功标志
          setTimeout(() => (this.submitSuccess = false), 3000); // 3秒后隐藏消息
        }
      } catch (e) {
        console.error("Error adding event: ", e);
        this.submitSuccess = false;
      }

      // 重置表单
      this.resetNewEvent();
    },

    resetNewEvent() {
      this.newEvent = {
        title: "",
        start: "",
        end: "",
        class: this.newEvent.class, // 保留当前选择的事件类型
        contentFull: "",
      };
    },
    formatDateTime(dateTime) {
      return moment(dateTime).format("YYYY-MM-DD HH:mm");
    },
  },
};
</script>

<style>
form {
    align-items:start;
  background-color: #fff; /* 表单背景色 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 给表单添加轻微的阴影 */
}

form select {
  width: 50%;
  padding: 12px 15px; /* 增加填充以提升触摸友好性 */
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px; /* 增大字体大小 */
}


form button {
  width: 100%;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px; /* 增大字体大小 */
}

form button:hover {
  background-color: #45a049;
}

.submit-success {
  color: #4caf50; /* 更鲜明的绿色 */
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
}

.event-form-view {
  padding: 20px;
  max-width: 600px; /* 限制最大宽度 */
  margin: 0 auto; /* 水平居中 */
}

@media (max-width: 600px) {
  .event-form-view {
    padding: 10px; /* 在较小屏幕上减少内边距 */
  }
}

@media (max-width: 600px) {
  input[type="datetime-local"] {
    font-size: 16px; /* 增大字体大小 */
    padding: 12px; /* 增加内边距 */
    border: 1px solid #ccc; /* 明显的边框 */
    border-radius: 4px; /* 圆角边框 */
  }
}
</style>
