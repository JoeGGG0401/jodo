import { createRouter, createWebHashHistory } from "vue-router";
import firebase from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // 确保路径正确
// 导入 Firestore 相关函数
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // 确保你有一个 db 实例的导出

import HomeView from "../views/HomeView.vue";
import RecordView from "../views/RecordView.vue";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";
import MySpaceView from '../views/MySpaceView.vue';
import SearchResultView from '../views/SearchResultView.vue';
import UserProfileView from '../views/UserProfileView.vue';



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
    path: "/myspace",
    name: "myspace",
    component: MySpaceView,
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

router.beforeEach(async (to, from, next) => {
  const user = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !user) {
    next("/login");
  } else {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, { email: user.email, name: user.displayName });
      }
    }

    next();
  }
});


export default router;
