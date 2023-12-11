import { createRouter, createWebHashHistory } from "vue-router";
import firebase from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // 确保路径正确
import HomeView from "../views/HomeView.vue";
import RecordView from "../views/RecordView.vue";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";

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

router.beforeEach((to, from, next) => {
  onAuthStateChanged(auth, (user) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    if (requiresAuth && !user) {
      next("/login"); // 如果需要认证但用户未登录，则重定向到登录页面
    } else {
      next(); // 否则正常导航
    }
  });
});

export default router;
