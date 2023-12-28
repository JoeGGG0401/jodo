// EChartsComponent.vue
<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: ['option'],
  mounted() {
    const chart = echarts.init(this.$refs.chart);
    chart.setOption(this.option);
  },
  watch: {
    option(newOption) {
      if (newOption) {
        const chart = echarts.init(this.$refs.chart);
        chart.setOption(newOption);
      }
    }
  },
};
</script>
