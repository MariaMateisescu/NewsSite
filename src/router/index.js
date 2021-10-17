import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import News from "@/views/News.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import Profile from "@/views/Profile.vue";
import Admin from "@/views/Admin.vue";
import CreateArticle from "@/views/CreateArticle.vue";
import ArticlePreview from "@/views/ArticlePreview.vue";
import ViewArticle from "@/views/ViewArticle.vue";
import EditArticle from "@/views/EditArticle.vue";
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
      requiresAuth: false,
    },
  },
  {
    path: "/news",
    name: "News",
    component: News,
    meta: {
      title: "News",
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login",
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register",
      requiresAuth: false,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: {
      title: "Forgot Password",
      requiresAuth: false,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: "Profile",
      requiresAuth: true,
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      title: "Admin",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/create-article",
    name: "CreateArticle",
    component: CreateArticle,
    meta: {
      title: "Create Article",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/article-preview",
    name: "ArticlePreview",
    component: ArticlePreview,
    meta: {
      title: "Preview Article",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/view-article/:articleid",
    name: "ViewArticle",
    component: ViewArticle,
    meta: {
      title: "View Article",
      requiresAuth: false,
    },
  },
  {
    path: "/edit-article/:articleid",
    name: "EditArticle",
    component: EditArticle,
    meta: {
      title: "Edit Article",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  document.title = `${to.meta.title} | NewsSite`;
  next();
});

router.beforeEach(async (to, from, next) => {
  let user = firebase.auth().currentUser;
  let admin = null;
  if (user) {
    let token = await user.getIdTokenResult();
    admin = token.claims.admin;
  }
  if (to.matched.some((res) => res.meta.requiresAuth)) {
    if (user) {
      if (to.matched.some((res) => res.meta.requiresAdmin)) {
        if (admin) {
          return next();
        }
        return next({ name: "Home" });
      }
      return next();
    }
    return next({ name: "Home" });
  }
  return next();
});

export default router;
