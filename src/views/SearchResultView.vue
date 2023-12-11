<template>
  <div class="search-results">
    <h1>搜索结果</h1>
    <div v-if="searchResults && searchResults.length">
      <ul>
        <li v-for="result in searchResults" :key="result.id">
          {{ result.name }}
          <!-- 更多用户信息 -->
        </li>
      </ul>
    </div>
    <div v-else>
      <p>没有找到相关结果。</p>
    </div>
  </div>
</template>

<script>
import UserService from "../services/UserService"; // 确保路径正确

export default {
  props: {
    query: String
  },
  data() {
    return {
      searchResults: []
    };
  },
  async created() {
    if (this.query) {
      this.searchResults = await UserService.searchUsersByName(this.query);
    }
  }
};
</script>
