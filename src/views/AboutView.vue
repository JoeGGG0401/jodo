<template>
  <div class="about">
    <h1>开发文档</h1>
    <DocCard v-for="doc in docs" :key="doc.key" :title="doc.title" :content="doc.content" />
  </div>
</template>

<script>
import DocCard from '@/components/DocCard.vue';
import docsData from './docs.json';

export default {
  components: {
    DocCard
  },
  data() {
    return {
      docs: docsData
    };
  }
};
</script>
