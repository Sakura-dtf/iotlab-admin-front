<template>
  <v-app>
    <v-card class="mh-500" >
      <div class="notice mgt-20 ">

        <div class="chip-item" v-for="(item,i) in notice" :key="item.id">
          <v-chip
              class="ma-2"
              color="pink"
              label
              text-color="white"
              v-if="i % 3 === 0"
          >
            <v-icon left>mdi-label</v-icon>
            {{ item.name }}
          </v-chip>
          <v-chip
              class="ma-2"
              color="cyan"
              label
              text-color="white"
              v-if="i % 3 === 1"
          >
            <v-icon left>mdi-label</v-icon>
            {{ item.name }}
          </v-chip>
          <v-chip
              class="ma-2"
              color="primary"
              label
              text-color="white"
              v-if="i % 3 === 2"

          >
            <v-icon left>mdi-label</v-icon>
            {{ item.name }}
          </v-chip>
        </div>

      </div>
      <div class="forum">
        <div class="chip-item" v-for="(item,i) in forum" :key="item.id">
          <v-chip
              class="ma-2"
              color="pink"
              label
              close
              text-color="white"
              v-if="i % 3 === 0"
              @click:close="deleteCategory(item.id)"
          >
            <v-icon left>mdi-label</v-icon>
            {{ item.name }}
          </v-chip>
          <v-chip
              class="ma-2"
              color="cyan"
              label
              close
              text-color="white"
              v-if="i % 3 === 1"
              @click:close="deleteCategory(item.id)"
          >
            <v-icon left>mdi-label</v-icon>
            {{ item.name }}
          </v-chip>
          <v-chip
              class="ma-2"
              color="primary"
              label
              close
              text-color="white"
              v-if="i % 3 === 2"
              @click:close="deleteCategory(item.id)"
          >
            <v-icon left>mdi-label</v-icon>
            {{ item.name }}
          </v-chip>
        </div>
      </div>

      <div class="btn-container">
        <v-row>
          <v-col cols="8">
            <v-text-field
                label="Solo"
                placeholder="Placeholder"
                solo
                v-model="category"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn small color="primary" style="width: 100px;height: 50px;" @click="addCategory">添加栏目</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: "Category",
  data: () => ({
    color: ['pink','primary','cyan'],
    notice: [],
    forum: [],
    flag: true,
    category: '',
  }),
  created() {
    this.getAllCategory();
  },
  methods: {
    async getAllCategory(){
      const {data: res} = await this.$http.get('category/getAllCategory');
      if(res.errno === 0){
        this.notice = res.data.splice(0,6);
        this.forum = res.data;
        //this.$message.success('获取栏目信息成功');
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else {
        this.$message.error('获取栏目失败，请联系管理员');
      }
    },
    async addCategory(){
      if(this.category){
        const {data : res} = await this.$http.post('category/add',{
          name: this.category
        })
        if(res.errno === 0){
          this.$message.success('添加栏目信息成功');
          await this.getAllCategory();
        }else if(res.errno === 1000){
          await this.$router.push('/login');
          this.$message.error('登录过时，请重新登录');
        }else {
          this.$message.error('添加栏目失败，请联系管理员');
        }
      }
    },
    async deleteCategory(id){
      console.log("11");
      const {data: res} = await this.$http.post('category/deleteCategory',{
        id
      })
      if(res.errno === 0){
        this.$message.success('删除栏目成功');
        await this.getAllCategory();
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else if(res.errno === 1021){
        this.$message.error("您不是管理员，您没有该权限");
        await this.getAllArticle();
      }else {
        this.$message.error('删除栏目失败，请查看该栏目是否有文章或者请联系管理员');
      }
    }
  }
}
</script>

<style scoped>
  .notice{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 90%;
    margin: 0 auto;
  }

  .forum{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 90%;
    margin: 0 auto;
  }

  .chip-item{
    height: 80px;
  }


  .btn-container{
    width: 50%;
    margin: 0 auto;
  }
</style>