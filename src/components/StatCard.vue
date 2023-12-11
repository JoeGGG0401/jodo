<template>
    <div class="stat-card">
      <h3>{{ title }}</h3>
      <p>{{ value }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      value: String
    }
  };
  </script>
  
  <style scoped>
  .stat-card {
  }
  </style>
  