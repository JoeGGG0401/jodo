const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  // 添加PWA配置
  pwa: {
    name: 'Jodo', // 应用的名称
    themeColor: '#4DBA87', // 主题颜色
    msTileColor: '#000000', // 微软磁贴颜色
    appleMobileWebAppCapable: 'yes', // 苹果移动Web应用配置
    appleMobileWebAppStatusBarStyle: 'black', // 苹果状态栏样式

    // 图标路径配置
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/mstile-150x150.png'
    },

    // 工作线程配置
    workboxPluginMode: 'GenerateSW', // 使用GenerateSW模式
    workboxOptions: {
      // 在这里可以添加更多的Workbox配置
    }
  }
});
