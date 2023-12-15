<template>
  <div class="event-form">
    <h3>睡眠记录</h3>

    <div class="form-group">
      <label for="startTime">开始时间:</label>
      <input v-model="startTime" type="datetime-local" id="startTime" />
    </div>

    <div class="form-group">
      <label for="endTime">结束时间:</label>
      <input v-model="endTime" type="datetime-local" id="endTime" />
    </div>

    <div class="form-group">
      <label for="preparation">睡前准备:</label>
      <input
        v-model="preparation"
        type="text"
        id="preparation"
        placeholder="睡前准备"
      />
    </div>

    <div class="form-group">
      <label for="thresholdAction">起床门槛行动:</label>
      <input
        v-model="thresholdAction"
        type="text"
        id="thresholdAction"
        placeholder="起床门槛行动"
      />
    </div>

    <div class="form-group">
      <label for="planAfterWaking">起来后准备做:</label>
      <input
        v-model="planAfterWaking"
        type="text"
        id="planAfterWaking"
        placeholder="起来后准备做"
      />
    </div>

    <div class="form-group">
      <label for="feelings">感觉:</label>
      <input v-model="feelings" type="text" id="feelings" placeholder="感觉" />
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
      preparation: "",
      thresholdAction: "",
      planAfterWaking: "",
      feelings: "",
    };
  },

  methods: {
    goToRecordPage() {
      this.$router.push("/record");
    },

    resetForm() {
      this.startTime = "";
      this.endTime = "";
      this.preparation = "";
      this.thresholdAction = "";
      this.planAfterWaking = "";
      this.feelings = "";
    },

    submitEvent() {
      const formattedStart = this.formatDateTime(this.startTime);
      const formattedEnd = this.formatDateTime(this.endTime);

      // 将答案格式化为统一的内容
      const contentFull = `
        ## 睡眠记录
        - 睡前准备: ${this.preparation}
        - 起床门槛行动: ${this.thresholdAction}
        - 起来后准备做: ${this.planAfterWaking}
        - 感觉: ${this.feelings}
        `;

      // 触发事件并传递数据
      this.$emit("submit", {
        title: "睡眠记录",
        class: "sleep",
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
