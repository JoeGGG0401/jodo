<template>
    <div class="doc-card">
      <h2>{{ title }}</h2>
      <div v-html="renderedContent"></div>
    </div>
  </template>
  
  <script>
  import MarkdownIt from 'markdown-it';
  
  export default {
    props: {
      title: String,
      content: String
    },
    computed: {
      renderedContent() {
        const md = new MarkdownIt();
        return md.render(this.content);
      }
    }
  };
  </script>
  
  <style scoped>
  .doc-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin: 10px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
  </style>
  