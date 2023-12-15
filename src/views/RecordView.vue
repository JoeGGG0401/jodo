<template>
  <div class="container">
    <div class="button-container">
      <button @click="goToFormPage" class="goToFormPageButton">添加事件</button>
    </div>

    <div class="calendar">
      <vue-cal
        class="vuecal--green-theme"
        events-on-month-view="short"
        :events="events"
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
      <div v-if="showDialog" class="dialog-backdrop" @click="closeDialog"></div>
      <div class="dialog" v-if="showDialog">
        <div class="card">
          <div class="card-title">
            <span>{{ selectedEvent.title }}</span>
            <span class="spacer"></span>
            <strong v-if="selectedEvent.start">
              {{ selectedEvent.start.format("YYYY/MM/DD") }}
            </strong>
          </div>
          <div class="card-text">
            <strong>记录详情:</strong>
            <ul>
              <li v-if="selectedEvent.start">
                开始时间: {{ selectedEvent.start.formatTime() }}
              </li>
              <li v-if="selectedEvent.end">
                结束时间: {{ selectedEvent.end.formatTime() }}
              </li>
              <p v-html="selectedEvent.contentFull"></p>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import moment from "moment";
import LogService from "../services/LogService";
import { auth } from "../firebase"; // 确保路径正确

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
  methods: {
    goToFormPage() {
      this.$router.push("/event-form"); // 假设您的表单页面的路由是 /event-form
    },
    closeDialog() {
      this.showDialog = false;
    },
    onEventClick(event, e) {
      this.selectedEvent = event;
      this.showDialog = true;

      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation();
    },
    async fetchEvents() {
      try {
        const user = auth.currentUser;
        if (user) {
          const events = await LogService.getUserLogs(user.uid);
          this.events = events.map((event) => {
            event.start = moment(event.start).toDate();
            event.end = event.end ? moment(event.end).toDate() : null;
            return event;
          });
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    },
  },
};
</script>

<style>
.goToFormPageButton {
  color: #fff;
}

.button-container {
  padding: 10px;
  flex-direction: row;
  align-content: flex-end;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 800px; /* 限制最大宽度 */
}

.calendar {
  width: 100%;
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

.vuecal--month-view .vuecal__cell {
  height: 150px;
}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date {
  padding: 0px;
}
.vuecal--month-view .vuecal__no-event {
  display: none;
}

.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  backdrop-filter: blur(5px); /* 模糊效果 */
  z-index: 99; /* 确保在弹窗下方 */
}

.dialog {
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  width: 66%;
  height: 66%;
}

.card-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.card-text {
  font-size: 14px;
  color: #333;
}

/* 响应式样式调整 */
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .vuecal--month-view .vuecal__cell {
    height: auto; /* 手机上自动调整高度 */
  }
}
</style>
