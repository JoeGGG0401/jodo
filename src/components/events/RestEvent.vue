<template>
  <div class="event-form">
    <h3>休息记录</h3>

    <div class="form-group">
      <label for="startTime">开始时间:</label>
      <input v-model="startTime" type="datetime-local" id="startTime" />
    </div>

    <div class="form-group">
      <label for="endTime">结束时间:</label>
      <input v-model="endTime" type="datetime-local" id="endTime" />
    </div>

    <div class="form-group">
      <label for="recentActivity">刚才在做什么:</label>
      <input
        v-model="recentActivity"
        type="text"
        id="recentActivity"
        placeholder="刚才在做什么"
      />
    </div>

    <div class="form-group">
      <label for="restMethod">休息方式:</label>
      <input
        v-model="restMethod"
        type="text"
        id="restMethod"
        placeholder="休息方式(低刺激)"
      />
    </div>

    <div class="form-group">
      <label for="finalAction">收尾动作:</label>
      <input
        v-model="finalAction"
        type="text"
        id="finalAction"
        placeholder="收尾动作"
      />
    </div>

    <div class="form-group">
      <label for="nextWork">准备继续什么工作:</label>
      <input
        v-model="nextWork"
        type="text"
        id="nextWork"
        placeholder="准备继续什么工作"
      />
    </div>

    <div class="form-group">
      <label for="thresholdAction">门槛行动:</label>
      <input
        v-model="thresholdAction"
        type="text"
        id="thresholdAction"
        placeholder="门槛行动"
      />
    </div>

      <button @click="submitEvent">提交</button>
      <button @click="goToRecordPage">返回我的记录</button>

  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      startTime: "",
      endTime: "",
      recentActivity: "",
      restMethod: "",
      finalAction: "",
      nextWork: "",
      thresholdAction: "",
    };
  },

  methods: {
    goToRecordPage() {
      this.$router.push("/record");
    },

    resetForm() {
      this.startTime = "";
      this.endTime = "";
      this.recentActivity = "";
      this.restMethod = "";
      this.finalAction = "";
      this.nextWork = "";
      this.thresholdAction = "";
    },

    submitEvent() {
      const formattedStart = this.formatDateTime(this.startTime);
      const formattedEnd = this.formatDateTime(this.endTime);

      // 将答案格式化为统一的内容
      const contentFull = `
        ## 休息记录
        - 刚才在做什么: ${this.recentActivity}.
        - 休息方式: ${this.restMethod}.
        - 收尾动作: ${this.finalAction}.
        - 准备继续什么工作: ${this.nextWork}.
        - 门槛行动: ${this.thresholdAction}.
        `;
      // 触发事件并传递数据
      this.$emit("submit", {
        title: "休息记录",
        class: "break",
        start: this.startTime,
        end: this.endTime,
        contentFull: contentFull,
      });
      this.resetForm();
    },
    formatDateTime(dateTime) {
      return moment(dateTime).format("YYYY-MM-DD HH:mm");
    },
  },
};
</script>

<style scoped>
.event-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.event-form h3 {
  text-align: center;
  color: #42b983;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="datetime-local"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
