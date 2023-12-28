<template>
    <div class="message-board">
      <div class="date-section" v-for="(messages, date) in groupedMessages" :key="date">
        <h3>{{ date }}</h3>
        <div class="messages-container">
          <div class="message-card" v-for="message in messages" :key="message.id">
            <div class="message-content" v-html="renderMarkdown(message.content)"></div>
            <div class="message-user">{{ message.user }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import MessageService from '../services/MessageService';
  import { generateFeedbackIfNecessary } from '../services/FeedbackService';
  import { auth } from "../firebase";
  import MarkdownIt from 'markdown-it';
  
  export default {
    data() {
      return {
        groupedMessages: {},
        markdownIt: new MarkdownIt()
      };
    },
    async created() {
      const user = auth.currentUser;
      if (user) {
        await generateFeedbackIfNecessary();
        this.groupedMessages = await MessageService.getUserMessages(user.uid);
      }
    },
    methods: {
      renderMarkdown(text) {
        return this.markdownIt.render(text);
      }
    }
  };
  </script>
  
  
  <style>
  .message-board {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 500px;
    text-align: start;
  }
  
  .date-section {
    width: 100%;
  }
  
  .messages-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .message-card {
    flex: 1;
    min-width: 200px;
    background: #f8f8f8;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .message-content {
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .message-user {
    font-size: 12px;
    text-align: right;
    color: #666;
  }
  
  @media (max-width: 600px) {
    .messages-container {
      flex-direction: column;
    }
  }
  </style>
  