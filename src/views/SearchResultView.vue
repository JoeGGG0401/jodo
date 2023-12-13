<template>
  <div class="search-results">
    <h1>搜索结果</h1>
    <div v-if="searchResults && searchResults.length">
      <ul class="result-list">
        <li v-for="result in searchResults" :key="result.id" class="result-item">
          <div class="avatar" v-if="result.photoURL" :style="{ backgroundImage: 'url(' + result.photoURL + ')' }"></div>
          <div class="avatar" v-else>{{ getInitial(result.name) }}</div>
          <span class="name">{{ result.name }}</span>
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
  },
  methods: {
    getInitial(name) {
      return name ? name.charAt(0).toUpperCase() : '';
    },
  }
};
</script>


<style>
/* ...其他样式... */

.result-list {
  list-style: none;
  padding: 0;
  margin: 0 5rem;
  align-items: center;
}

.result-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  max-width: 36px;
  max-height: 36px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #42b983;
  color: white;
  margin-right: 10px;
}

.name {
  font-size: 1.2em;
}
</style>
