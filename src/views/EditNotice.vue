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
                        <v-form>
                          <v-file-input
                              type="file"
                              v-model="avatar"
                              ref="file"
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

                        </v-form>

                        <v-select
                                v-model="category"
                                :items="categories"
                                label="通知类型"
                        ></v-select>
                        <v-text-field class="mgt-10" label="标题" v-model="title" :rules="titleRules" hide-details="auto"></v-text-field>
                        <v-text-field class="mgt-10" label="介绍" v-model="describe" :rules="titleRules" hide-details="auto"></v-text-field>
                    </v-col>
                </v-row>
                <v-btn color="primary" class="mgt-20" @click="e6 = 2">下一步</v-btn>
                <v-btn class="mgt-20" text>上一步</v-btn>

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
                        :ishljs="true"
                        :style="cssFlag ? sty1 : sty2"
                />
                <v-btn color="primary" class="mgt-20" @click="submit">提交</v-btn>
                <v-btn text class="mgt-20" @click="e6 = e6-1">上一步</v-btn>
            </v-stepper-content>
        </v-stepper>

    </v-card>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: "EditNotice",
        data: () => ({
            title: '',
            avatarStr: '',
            describe: '',
            readMore: 25,
            category: '',
            categories: [],
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
          this.getNoticeInfo();
      },
      methods: {
            async uploadFile() {
              let formData=new FormData();

              console.log(this.avatar);

              formData.append('file',this.avatar)

              console.log(formData)

              const { data: res } = await this.$http({
                url: 'utils/upload',
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data'},
              })

               if(res.errno === 0){
                 this.avatarStr = res.data.url;
               }
                console.log(res);


            },

            async submit(){
               const {data : res} = await this.$http.post('article/updateNoticeArticle',{
                 id: parseInt(this.$route.query.id),
                 title: this.title,
                  describe: this.describe,
                  categoryId: this.category,
                  content: this.html,
                  image: this.avatarStr
               })

              if(res.errno === 0){
                  this.$message.success("修改文章成功");
                  window.location.reload();
              }else if(res.errno === 1000){
                await this.$router.push('/login');
                this.$message.error('登录过时，请重新登录');
              }else{
                  this.$message.error("修改文章失败，请联系管理员");
              }
            },
            readModel(){
                console.log(status,value);
                this.cssFlag = !this.cssFlag;
            },

            fullScreen(status,value){
                this.cssFlag = !this.cssFlag;
            },

            async $imgAdd(pos, $file) {
              // 第一步.将图片上传到服务器.
              let formData = new FormData();
              formData.append('file', $file);
              console.log(formData);
              const { data: res } = await this.$http({
                url: 'utils/upload',
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data'},
              })

              if(res.errno === 0){
                this.$refs.md.$img2Url(pos, res.data.url);
              }

            },
            $imgDel(pos) {
              delete this.img_file[pos];
            },

            // 所有操作都会被解析重新渲染
            change(value, render){
                // render 为 markdown 解析后的结果[html]
                this.html = render;
            },
            async getCategories(){
              const { data: res} = await this.$http.get('category/getNoticeCategory');
              if(res.errno === 0){
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
              }
            },
            async getNoticeInfo(){
                const {data: res} = await this.$http.post('article/getOneArticle',{
                    id: parseInt(this.$route.query.id)
                })
              console.log(res);
                if(res.errno === 0){
                    this.title = res.data.title;
                    this.content = res.data.content;
                    this.avatarStr = res.data.image;
                    this.category = res.data.categoryId
                    if(res.data.describe){
                      this.describe = res.data.describe;
                    }

                }else if(res.errno === 1000){
                  await this.$router.push('/login');
                  this.$message.error('登录过时，请重新登录');
                }

            }
        },
        components:{
            mavonEditor
        }
    }
</script>

<style scoped>

</style>