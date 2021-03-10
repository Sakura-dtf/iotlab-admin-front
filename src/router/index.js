import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "../views/Home";
import User from "../views/User";
import Article from "../views/Article";
import AddArticle from "../views/AddArticle";
import AddNotice from "../views/AddNotice";
import Person from "../views/Person";
import EditUser from "../views/EditUser";
import EditArticle from "../views/EditArticle";
import EditNotice from "../views/EditNotice";
import Login from "../views/Login";
import Register from "../views/Register";
import Category from "../views/Category";
import Photo from "../views/Photo";
import MyPDF from "../views/MyPDF";
import AllPDF from "../views/AllPDF";

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/register', component: Register},
  {path: '/home', component: Home, redirect: '/user',children: [
      {path: '/user', component: User},
      {path: '/article', component: Article},
      {path: '/addArticle', component: AddArticle},
      {path: '/addNotice', component: AddNotice,meta: {isSuper_require: true}},
      {path: '/person', component: Person},
      {path: '/editUser',component: EditUser},
      {path: '/editMyUser',component: EditUser},
      {path: '/editArticle', component: EditArticle},
      {path: '/editMyArticle', component: EditArticle},
      {path: '/editNotice', component: EditNotice},
      {path: '/editMyNotice', component: EditNotice},
      {path: '/category', component: Category},
      {path: '/photo', component: Photo},
      {path: '/mypdf', component: MyPDF},
      {path: '/pdf', component: AllPDF,meta: {isSuper_require: true}},
  ]},
]

const router = new VueRouter({
    routes
})



export default router
