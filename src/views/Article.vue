<template>
    <v-card class="mh-500">
        <v-card-title>
            <v-row>
                <v-col cols="6" class="col-xs-12" >
                    <v-select
                            v-model="value"
                            :items="items"
                            chips
                            label="栏目"
                            multiple
                            @change="selectChange"
                    ></v-select>
                </v-col>
                <v-col cols="6" class="col-xs-12">
                    <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            chips
                            single-line
                            hide-details
                            class="pdt-21"
                    ></v-text-field>
                </v-col>
            </v-row>



        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="desserts"
                :search="search"
                :items-per-page="6"
                item-key="id"
        >
            <template v-slot:item.auth = "{ item }">
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

    </v-card>
</template>

<script>
    import marked from 'marked'
    export default {
        name: "Article",
        data: () => ({
            items: [],
            value: [],
            expanded: [],
            singleExpand: true,
            search: '',
            classifyModel: [
                '通知文章',
                '项目文章',
                '自传文章',
                '成果文章',
                '学术文章'
            ],
            headers: [
                {
                    text: '标题',
                    align: 'start',
                    sortable: false,
                    value: 'title',
                },
                { text: '文章类型',  value: 'classify' },
                { text: '文章分类',  value: 'category' },
                { text: '文章阅读量',  value: 'readNum' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            desserts: [],
        }),
        created() {
            this.getCategory();
            this.getAllArticle();
        },
        methods: {
              selectChange(){
                  console.log(this.value);
                  this.getAllArticle();
              },
              editItem (item) {
                  this.editedIndex = this.desserts.indexOf(item)
                  this.editedItem = Object.assign({}, item)
                  if(item.classify === '学术文章'){
                      this.$router.push({path: '/editArticle', query: {id: item.id}})
                  }else {
                      this.$router.push({path: '/editNotice', query: {id: item.id}})
                  }
              },

              async deleteItem (item) {
                const { data: res } = await this.$http.post('article/deleteArticle',{
                      id: item.id
                  })

                  if(res.errno === 0){
                    this.$message.success('删除文章成功');
                    window.location.reload();
                  }else if(res.errno === 1000){
                    await this.$router.push('/login');
                    this.$message.error('登录过时，请重新登录');
                  }else if(res.errno === 1021){
                    this.$message.error("您不是管理员，您没有该权限");
                    await this.getAllArticle();
                  }else{
                    this.$message.error('删除文章失败，请联系管理员');
                  }
              },

              async getCategory(){
                  const {data: res} = await this.$http.get('category/getAllCategory')
                  if(res.errno === 0){
                      res.data.forEach(item => {
                          let temp = {
                              text: item.name,
                              value: item.id
                          }
                          this.items.push(temp);
                      })
                  }else if(res.errno === 1000){
                      //this.$router.push('/login');
                    this.$message.error('登录超时，请联系管理员');
                  }
              },
              async getAllArticle(){
                  const {data: res} = await this.$http.get('article/getAllArticle',{
                      params: {
                          categories: JSON.stringify(this.value)
                      }
                  })

                  if(res.errno === 0){
                      this.desserts = [];
                      res.data.forEach( item => {
                        let temp = {
                            id: item.id,
                            title: item.title,
                            readNum: item.readNum,
                            classify: this.classifyModel[item.index-1]
                          };

                          this.items.forEach(item1 => {
                              if(item1.value === item.categoryId){
                                  console.log(item1.value,item1.text,item.categoryId)
                                  temp.category = item1.text;
                              }
                          })
                          this.desserts.push(temp);
                      })
                  }else if(res.errno === 1000){
                    await this.$router.push('/login');
                    this.$message.error('登录过时，请重新登录');
                  }else {
                      this.$message.error('获取文章信息失败，请联系管理员')
                  }
              }
          },
    }
</script>

<style scoped>
  @import "../assets/css/github-markdown.css";
  .title{
      width: 100%;
  }
  .content{
      width: 100%;
      text-align: left;
  }
</style>