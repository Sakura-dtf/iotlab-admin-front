<template>
  <v-card class="mh-500">
    <v-row>
      <v-col cols="3" class="col-xs-12">

          <a v-if="userInfo.payment" :href="userInfo.payment" target="_blank">
            <v-avatar color="orange" tile  size="150">
              <img
                  :src="userInfo.payment"
                  alt="收款码"
              >
            </v-avatar>


          </a>
          <a  v-else href="../assets/images/avatar.jpg" target="_blank">
            <v-avatar color="orange" tile  size="150">
              <img src="../assets/images/avatar.jpg" alt="付款码">
            </v-avatar>

          </a>

      </v-col>
      <v-col cols="3" class="col-xs-12">
          <a v-if="userInfo.avatar" :href="userInfo.avatar"  target="_blank">

            <v-avatar color="orange" tile  size="150">
              <img
                  :src="userInfo.avatar"
                  :alt="userInfo.name"
              >
            </v-avatar>
          </a>
          <a v-else href="../assets/images/avatar.jpg" target="_blank">
            <v-avatar color="orange" tile  size="150">
              <img src="../assets/images/avatar.jpg" alt="userInfo.name">
            </v-avatar>

          </a>
      </v-col>
      <v-col cols="6" class="col-xs-12">
        <div class="user-info">姓名：{{ userInfo.name }}</div>
        <div class="user-info">用户名：{{ userInfo.username }}</div>
        <v-btn tile outlined color="success" class="user-btn" to="/editMyUser">
          <v-icon left>mdi-pencil</v-icon>
          修改
        </v-btn>
      </v-col>
    </v-row>

    <v-card-title>
      文章列表
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
        :items-per-page="5"
        item-key="id"
    >
      <template v-slot:item.auth="{ item }">
        <v-switch v-model="item.auth" :label="item.auth ? '超级管理员' : '普通用户'" style="text-align: center"></v-switch>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <div class="user-describe">
      <div class="title">{{personTitle}}</div>
      <div class="markdown-body"  v-html="personContent"></div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "Person",
  data: () => ({
    search: '',
    expanded: [],
    singleExpand: true,
    classifyModel: [
      '通知文章',
      '项目文章',
      '成果文章',
      '自传文章',
      '学术文章'
    ],
    category: [],
    headers: [
      {
        text: '标题',
        align: 'start',
        sortable: false,
        value: 'title',
      },
      {text: '文章类型', value: 'classify'},
      {text: '文章分类', value: 'category'},
      {text: '文章阅读量', value: 'readNum'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],
    desserts: [],
    userInfo: {},
    personTitle: '',
    personContent: '',
  }),
  created() {
    this.getUserInfo();
    this.getCategory();
  },
  methods: {
    async getUserInfo() {
      const {data: user} = await this.$http.get('user/getOneUser');
      if (user.errno === 0) {
        this.userInfo = user.data;
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }
      const {data: articles} = await this.$http.get('article/getUserAllArticle');
      if (articles.errno === 0) {

        this.desserts = [];
        var temp = {}
        articles.data.forEach((item, i) => {
          temp = {
            id: item.id,
            title: item.title,
            readNum: item.readNum,
            index: item.index,
            classify: this.classifyModel[item.index - 1]
          };
          this.category.forEach(item1 => {
            if (item1.value === item.categoryId) {
              temp.category = item1.text;
            }
          })
          if (item.index === '3') {
            this.personTitle = item.title;
            this.personContent = this.md2html(item.content);
          } else {
            this.desserts.push(temp);
          }
        })

      } else if(res.errno === 1000){
          await this.$router.push('/login');
          this.$message.error('登录过时，请重新登录');
      }
    },
    async getCategory() {
      const {data: res} = await this.$http.get('category/getAllCategory')
      if (res.errno === 0) {
        res.data.forEach(item => {
          let temp = {
            text: item.name,
            value: item.id
          }
          this.category.push(temp);
        })
      } else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }
    },
    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      if(item.classify === '学术文章'){
        this.$router.push({path: '/editMyArticle', query: {id: item.id}})
      }else {
        this.$router.push({path: '/editMyNotice', query: {id: item.id}})
      }
    },

    async deleteItem (item) {
      const { data: res } = await this.$http.post('article/deleteMyArticle',{
        id: item.id
      })
      console.log(res);
      if(res.errno === 0){
        //window.location.reload();
        await this.getUserInfo();
        this.$message.success("删除成功");
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else{
        this.$message.error('删除用户失败')
      }
    },
  }
}
</script>

<style scoped>
.user-info {
  font-size: 2rem;
  line-height: 70px;
  text-align: center;
}

.title{
  text-align: center;
}
.user-describe {
  margin-top: 10px;
  text-align: start;
  padding: 20px;
}


.user-btn {
  width: 150px;
  margin-top: 16px;
}
</style>