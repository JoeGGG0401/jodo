<template>
  <div class="container">
    <div class="calendar">
      <vue-cal
        class="vuecal--green-theme"
        events-on-month-view="short"
        :events="events"
        locale="zh-cn"
        :disable-views="['years', 'year']"
        :time-from="0 * 60"
        :time-to="24 * 60"
        :dbl-click-to-navigate="false"
        :on-event-click="onEventClick"
        @ready="fetchEvents"
        @view-change="fetchEvents"
      >
        <template #cell-content="{ cell, view, goNarrower, events }">
          <div class="vuecal__cell-date" :class="view.id" @click="goNarrower">
            <span class="clickable">{{ cell.content }}</span>
          </div>
          <span
            class="vuecal__cell-events-count"
            v-if="view.id === 'month' &amp;&amp; events.length"
            >{{ events.length }}</span
          ><span
            class="vuecal__no-event"
            v-if="['week', 'day'].includes(view.id) &amp;&amp; !events.length"
            >没有记录📝</span
          >
        </template>
      </vue-cal>
      <v-dialog v-model="showDialog">
        <v-card>
          <v-card-title>
            <span>{{ selectedEvent.title }}</span>
            <v-spacer />
            <strong>{{
              selectedEvent.start && selectedEvent.start.format("YYYY/MM/DD")
            }}</strong>
          </v-card-title>
          <v-card-text>
            <strong>记录详情:</strong>
            <ul>
              <li>
                开始时间:
                {{ selectedEvent.start && selectedEvent.start.formatTime() }}
              </li>
              <li>
                结束时间:
                {{ selectedEvent.end && selectedEvent.end.formatTime() }}
              </li>
              <p v-html="selectedEvent.contentFull" />
            </ul>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <div class="form">
      <form @submit.prevent="addEvent">
        <input v-model="newEvent.title" type="text" placeholder="标题" />
        <input
          v-model="newEvent.start"
          type="datetime-local"
          placeholder="开始时间"
        />
        <input
          v-model="newEvent.end"
          type="datetime-local"
          placeholder="结束时间"
        />

        <select v-model="newEvent.class">
          <option value="work">工作记录</option>
          <option value="break">休息记录</option>
          <option value="sleep">睡眠记录</option>
        </select>

        <v-md-editor
          v-model="newEvent.contentFull"
          :placeholder="contentFullPlaceholder"
          height="400px"
        ></v-md-editor>

        <button type="submit">添加记录</button>
      </form>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import moment from "moment";
import EventService from "../services/EventService";

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      selectedEvent: {},
      showDialog: false,
      events: [],
      newEvent: {
        title: "",
        start: "",
        end: "",
        class: "work",
        contentFull: "",
      },
    };
  },
  computed: {
    contentFullPlaceholder() {
      switch (this.newEvent.class) {
        case "work":
          return "请输入工作记录详情..\n - 哪项任务？\n - 多长时间？\n - 自我察觉 \n - 自我认同";
        case "break":
          return "请输入休息记录详情...\n - 刚才在做？\n - 我想在要通过什么方式休息？\n - 收尾动作是？ \n - 准备继续什么工作？ \n - 门槛行动？";
        case "sleep":
          return "请输入睡眠记录详情... \n - 睡前准备 \n - 起床门槛行动？ \n - 起来后准备做？ \n - 我感觉？";
        default:
          return "";
      }
    },
  },
  methods: {
    onEventClick(event, e) {
      this.selectedEvent = event;
      this.showDialog = true;

      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation();
    },
    async fetchEvents() {
      try {
        const events = await EventService.getAll();
        this.events = events;
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    },
    async addEvent() {
      // 转换开始和结束时间格式
      const formattedStart = this.formatDateTime(this.newEvent.start);
      const formattedEnd = this.formatDateTime(this.newEvent.end);

      console.log(formattedStart);
      console.log(formattedEnd);

      // 添加事件
      var data = {
        title: this.newEvent.title,
        start: formattedStart,
        end: formattedEnd,
        class: this.newEvent.class,
        contentFull: this.newEvent.contentFull,
        content: "点击查看详情🔎",
      };

      try {
        await EventService.create(data);
        console.log("Created new item successfully!");
        // 可以在此处更新事件列表
        this.fetchEvents();
      } catch (e) {
        console.log(e);
      }

      // 重置表单
      this.newEvent = {
        title: "",
        start: "",
        end: "",
        class: "work",
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
.container {
  display: flex;
  flex-direction: column; /* 默认为列方向 */
  /* 其他样式保持不变 */
}

@media (min-width: 600px) { /* 假设600px为手机和桌面的分界点 */
  .container {
    flex-direction: row; /* 桌面设备上使用行方向 */
  }

  .calendar,
  .form {
    flex: 1;
  }

  .calendar {
    max-width: 60%;
    padding: 0 20px;
    margin-bottom: 20px;
  }

  .form {
    max-width: 40%;
  }
}

form input[type="text"],
form input[type="datetime-local"],
form select {
  width: 100%; /* 输入框全宽 */
  padding: 10px; /* 内边距 */
  margin: 10px 0; /* 间距 */
  border: 1px solid #ccc; /* 边框 */
  border-radius: 5px; /* 圆角边框 */
}

form button {
  width: 100%; /* 按钮全宽 */
  padding: 10px; /* 内边距 */
  background-color: #42b983; /* 背景颜色 */
  color: white; /* 文字颜色 */
  border: none; /* 无边框 */
  border-radius: 5px; /* 圆角边框 */
  cursor: pointer; /* 鼠标样式 */
  margin: 10px 0;
}

form button:hover {
  background-color: #45a049; /* 悬停时背景颜色 */
}

/* Different color for different event types. */
.vuecal__event.work {
  background-color: rgba(39, 184, 37, 0.9);
  border: 1px solid rgba(31, 128, 29, 0.9);
  color: #fff;
}
.vuecal__event.break {
  background-color: rgba(223, 212, 18, 0.9);
  border: 1px solid rgba(155, 155, 31, 0.914);
  color: #fff;
}
.vuecal__event.sleep {
  background-color: rgba(102, 204, 255, 0.9);
  border: 1px solid rgba(35, 123, 168, 0.9);
  color: #fff;
}

.vuecal__event {
  cursor: pointer;
}

.vuecal__event-title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 4px 0 8px;
}

.vuecal__event-time {
  display: inline-block;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.vuecal__event-content {
  font-style: italic;
}

.vuecal--month-view .vuecal__cell {height: 150px;}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date {padding: 0px;}
.vuecal--month-view .vuecal__no-event {display: none;}

</style>