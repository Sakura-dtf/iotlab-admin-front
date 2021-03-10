<template>
  <v-card>
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1">
        基本信息
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-row>
          <v-col cols="5" class="col-xs-12">
            <v-avatar color="orange" size="250">
              <img
                  :src="avatarStr === null ? require('../assets/images/avatar.jpg') :  avatarStr"
                  alt="缩略图"
              >
            </v-avatar>
          </v-col>
          <v-col cols="6" class="col-xs-12">
            <v-file-input
                v-model="avatar"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an image"
                show-size
                prepend-icon="mdi-camera"
                @change="uploadFile"
                label="缩略图">
              <template v-slot:selection="{ text }">
                <v-chip
                    small
                    label
                    color="primary"
                >
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>
            <v-select
                v-model="category"
                :items="categories"
                label="文章栏目"
            ></v-select>
            <v-text-field class="mgt-10" label="标题" v-model="title" :rules="titleRules"
                          hide-details="auto"></v-text-field>
            <v-text-field class="mgt-10" label="阅读量" v-model="readNum" hide-details="auto" disabled></v-text-field>
          </v-col>
        </v-row>
        <v-btn color="primary" class="mgt-20" @click="e6 = 2">下一步</v-btn>
        <v-btn class="mgt-20" text>撤销</v-btn>

      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2">正文修改</v-stepper-step>

      <v-stepper-content step="2">
        <mavon-editor
            v-model="content"
            ref="md"
            @imgAdd="$imgAdd"
            @imgdel="$imgDel"
            @change="change"
            @fullScreen="fullScreen"
            @readModel="readModel"
            :style="cssFlag ? sty1 : sty2"
        />
        <v-btn color="primary" class="mgt-20" @click="submit">提交</v-btn>
        <v-btn text class="mgt-20" @click="e6 = e6-1">上一步</v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-card>
</template>

<script>
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: "EditArticle",
  data: () => ({
    readNum: 25,
    title: '',
    category: '',
    categories: [],
    avatarStr: '',
    e6: 1,
    avatar: {},
    titleRules: [
      value => !!value || 'Required.',
    ],
    content: '',
    cssFlag: true,
    sty1: "min-height: 420px; z-index: 0",
    sty2: "min-height: 420px; z-index: 1500",
    html: '',
  }),
  created() {
    this.getCategories();
    this.getForumInfo();
  },
  methods: {
    async submit() {
      const {data: res} = await this.$http.post('article/updateForumArticle', {
        title: this.title,
        content: this.content,
        image: this.avatarStr,
        categoryId: this.category,
        id: parseInt(this.$route.query.id)
      })
      if (res.errno === 0) {
        await this.getForumInfo();
        this.$message.success('修改文章成功');
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      } else {
        this.$message.error('修改文章失败，请联系管理员');
      }
    },
    async uploadFile() {
      let formData=new FormData();
      formData.append('file',this.avatar);
      const { data: res } = await this.$http({
        url: 'utils/upload',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data'},
      })
      if(res.errno === 0){
        this.avatarStr = res.data.url;
        this.$message.success('上传文件成功');
      }else {
        this.$message.error('请重新上传文件，或者联系管理员');
      }
    },
    readModel() {
      this.cssFlag = !this.cssFlag;
    },

    fullScreen(status, value) {
      this.cssFlag = !this.cssFlag;
    },

    // 将图片上传到服务器，返回地址替换到md中
    async $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      let formData = new FormData();
      formData.append('file', $file);

      const { data: res } = await this.$http({
        url: 'utils/upload',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data'},
      })
      if(res.errno === 0){
        this.$refs.md.$img2Url(pos, res.data.url);
        this.$message.success('上传文件成功');
      }else {
        this.$message.error('请重新上传文件，或者联系管理员');
      }
    },
    $imgDel(pos) {
      delete this.img_file[pos];
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },
    async getCategories() {
      const {data: res} = await this.$http.get('category/getForumCategory');
      if (res.errno === 0) {
        res.data.forEach(item => {
          let temp = {
            text: item.name,
            value: item.id
          }
          this.categories.push(temp);
        })
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else {
        this.$message.error('获取栏目信息失败');
      }
    },
    async getForumInfo() {
      const {data: res} = await this.$http.post('article/getOneArticle', {
        id: parseInt(this.$route.query.id)
      })
      console.log(res);

      if (res.errno === 0) {
        this.title = res.data.title;
        this.content = res.data.content;
        this.avatarStr = res.data.image;
        this.category = res.data.categoryId
        this.readNum = res.data.readNum;
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else {
        this.$message.error('获取信息失败，请联系管理利员');
      }

    }
  },
  components: {
    mavonEditor
  }
}
</script>

<style scoped>

</style>