<template>
  <div class="about">
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

<style>
.about {
  column-count: 2; /* 默认情况下显示两列 */
  column-gap: 20px; /* 列之间的间隙 */
}

/* 可选：防止卡片被拆分到两列 */
.doc-card {
  break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: 20px; /* 卡片之间的间距 */
}

/* 在小屏幕上，一行只显示一个文章 */
@media (max-width: 768px) {
  .about {
    column-count: 1; /* 当屏幕宽度小于等于768px时，只显示一列 */
  }
}
</style>
