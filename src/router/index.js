import { createRouter, createWebHashHistory } from "vue-router";
import firebase from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // 确保路径正确
// 导入 Firestore 相关函数
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // 确保你有一个 db 实例的导出

import HomeView from "../views/HomeView.vue";
import RecordView from "../views/RecordView.vue";
import EventFormView from "../views/EventFormView.vue";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";
import MySpaceView from '../views/MySpaceView.vue';
import SearchResultView from '../views/SearchResultView.vue';
import UserProfileView from '../views/UserProfileView.vue';
import MessageView from '../views/MessageView.vue';


const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/record",
    name: "record",
    component: RecordView,
    meta: { requiresAuth: true }, // 只有认证用户才能访问
  },
  {
    path: "/event-form",
    name: "event-form",
    component: EventFormView,
    meta: { requiresAuth: true }, // 只有认证用户才能访问
  },
  {
    path: "/myspace",
    name: "myspace",
    component: MySpaceView,
    meta: { requiresAuth: true }, // 只有认证用户才能访问
  },
  {
    path: "/message",
    name: "message",
    component: MessageView,
    meta: { requiresAuth: true }, // 只有认证用户才能访问
  },
  {
    path: '/user-profile',
    name: 'userProfile',
    component: UserProfileView,
    meta: { requiresAuth: true }, // 只有认证用户才能访问
  },
  {
    path: '/search/:query',  // 添加 :query 作为路由参数
    name: 'search',
    component: SearchResultView,
    props: true,  // 确保启用了 props
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/logout",
    name: "logout",
    component: LogoutView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
let isAuthReady = false;  // 用于跟踪认证状态是否准备好

// 监听认证状态改变
onAuthStateChanged(auth, (user) => {
  isAuthReady = true;  // 认证状态已准备好
  if (!user && router.currentRoute.value.meta.requiresAuth) {
    // 如果用户未登录且当前路由需要认证，则重定向到登录页面
    router.push('/login');
  }
});

router.beforeEach(async (to, from, next) => {
  if (!isAuthReady) {
    // 认证状态尚未准备好时，等待一段时间
    await new Promise(resolve => {
      const checkAuthReady = setInterval(() => {
        if (isAuthReady) {
          clearInterval(checkAuthReady);
          resolve();
        }
      }, 100);  // 每 100 毫秒检查一次
    });
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !auth.currentUser) {
    next('/login');
  } else {
    next();
  }
});


export default router;
