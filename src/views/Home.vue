<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-navigation-drawer
                v-model="drawer"
                app
        >
          <v-list dense>
            <v-list-item link to="/user">
              <v-list-item-action>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-normal"></use>
                </svg>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>用户管理</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/article">
              <v-list-item-action>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-wenzhang2-copy-copy"></use>
                </svg>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>文章管理</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/person">
              <v-list-item-action>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-gerenzhongxin_xuanzhong-copy"></use>
                </svg>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>个人中心</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/category">
              <v-list-item-action>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-lanmuxinxiguanli"></use>
                </svg>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>栏目管理</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/photo">
              <v-list-item-action>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhaopian"></use>
                </svg>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>照片墙管理</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/mypdf">
              <v-list-item-action>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fapiao"></use>
                </svg>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>我的发票</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!--<v-list-item link to="pdf">
              <v-list-item-action>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fapiao1"></use>
                </svg>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>发票管理</v-list-item-title>
              </v-list-item-content>
            </v-list-item>-->
            <v-list-item link to="/addArticle">
              <v-list-item-action>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fabiaowenzhang"></use>
                </svg>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>发布文章</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/addNotice">
              <v-list-item-action>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fabiaowenzhang"></use>
                </svg>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>发布通知</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

        </v-navigation-drawer>

        <v-app-bar
                app
                color="indigo"
                dark
        >
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title style="overflow: visible;">物联网实验室后台管理系统</v-toolbar-title>


          <div class="mgl-35p">
            <v-btn color="primary" to="/addArticle">发布文章</v-btn>
          </div>

          <div class="mgl-40">
            <v-btn color="primary" to="/addNotice">发布通知</v-btn>
          </div>

          <div class="mgl-40">
            <v-btn color="primary" @click="loginOut">退出登录</v-btn>
          </div>

        </v-app-bar>

        <v-main>
          <v-container
                  class="fill-height"
                  fluid
          >
            <v-row
                    align="center"
                    justify="center"
            >
              <v-col class="text-center">
                <router-view></router-view>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
        <v-footer
                color="indigo"
                app
        >
          <span class="white--text">&copy; 2019</span>
        </v-footer>
      </v-app>
    </v-app>
  </div>
</template>

<script>


export default {
  name: 'Home',
  data: () => ({
    drawer: null,
  }),
  methods: {
    loginOut(){
      window.localStorage.clear();
      this.$router.push('/login');
    }
  },
  components: {

  }
}
</script>
