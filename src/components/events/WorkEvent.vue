<template>
  <div class="event-form">
    <h3>工作记录</h3>

    <div class="form-group">
      <label for="startTime">开始时间: <span class="required">*</span></label>
      <input v-model="startTime" type="datetime-local" id="startTime" required />
    </div>

    <div class="form-group">
      <label for="endTime">结束时间: <span class="required">*</span></label>
      <input v-model="endTime" type="datetime-local" id="endTime" required />
    </div>

    <!-- 问卷式输入 -->
    <div class="form-group">
      <label for="task">你完成了哪项任务？ <span class="required">*</span></label>
      <input v-model="task" type="text" id="task" placeholder="任务内容" required />
    </div>

    <div class="form-group">
      <label for="duration">花费了多长时间？ <span class="required">*</span></label>
      <input v-model="duration" type="text" id="duration" placeholder="持续时间" required />
    </div>

    <div class="form-group">
      <label for="observation">你的感受如何？ <span class="required">*</span></label>
      <input v-model="observation" type="text" id="observation" placeholder="感受" required />
    </div>

    <div class="form-group">
      <label for="recognition">你做得最好的部分是什么？ <span class="required">*</span></label>
      <input v-model="recognition" type="text" id="recognition" placeholder="优秀之处" required />
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
      task: "",
      duration: "",
      observation: "",
      recognition: "",
    };
  },
  methods: {
    goToRecordPage() {
      this.$router.push("/record");
    },

    resetForm() {
      this.startTime = "";
      this.endTime = "";
      this.task = "";
      this.duration = "";
      this.observation = "";
      this.recognition = "";
    },

    submitEvent() {
      const formattedStart = this.formatDateTime(this.startTime);
      const formattedEnd = this.formatDateTime(this.endTime);

      // 将答案格式化为统一的内容
      const contentFull = `
        ## 工作记录
        - 任务内容: ${this.task}.
        - 工作持续时间: ${this.duration}.
        - 感受: ${this.observation}.
        - 优秀之处: ${this.recognition}
        `;
      // 触发事件并传递数据
      this.$emit("submit", {
        title: "工作记录",
        class: "work",
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

.required {
  color: red;
}

</style>
