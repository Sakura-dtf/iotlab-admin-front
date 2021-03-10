<template>
    <v-card>
        <v-card-title>
            <v-row style="width: 100%;">
                <v-col cols="20">
                    <v-text-field label="文章标题" :rules="rules" hide-details="auto" v-model="title"></v-text-field>
                </v-col>
                <v-col cols="4" class="pdt-24">
                    <v-btn outlined color="indigo" @click="goToDialog">发布文章</v-btn>
                </v-col>
            </v-row>
            <v-row style="width: 100%;">
              <mavon-editor
                  v-model="content"
                  ref="md"
                  @imgAdd="$imgAdd"
                  @change="change"
                  @fullScreen="fullScreen"
                  @readModel="readModel"
                  @imgdel="$imgDel"
                  :style="cssFlag ? sty1 : sty2"
              />
            </v-row>

        </v-card-title>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">发布文章</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                        v-model="category"
                                        :items="categories"
                                        label="文章栏目"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-file-input
                                              v-model="image"
                                              accept="image/png, image/jpeg, image/bmp"
                                              placeholder="Pick an image"
                                              show-size
                                              prepend-icon="mdi-camera"
                                              label="缩略图"
                                              @change="uploadFile"
                                >
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
                            </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="6">
                            <v-text-field label="通知介绍" hide-details="auto" v-model="describe">

                            </v-text-field>
                          </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
                    <v-btn color="blue darken-1" text @click="submit">提交</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: "Person",
        data: () => ({
            imageStr: '',
            describe:'',
            image: {},
            category: '',
            categories: [],
            dialog: false,
            content: '',
            cssFlag: true,
            sty1: "min-height: 420px; z-index: 0;width: 100%;",
            sty2: "min-height: 420px; z-index: 1500;width: 100%;",
            html: '',
            title: '',
            rules: [
                value => !!value || 'Required.',
                value => (value && value.length >= 3) || 'Min 3 characters',
            ],
        }),
        created() {
          this.getCategories();
        },
      methods:{
            goToDialog(){
              this.dialog = true;
            },
            readModel(){
                this.cssFlag = !this.cssFlag;
            },

            fullScreen(status,value){
                this.cssFlag = !this.cssFlag;
            },
            async uploadFile() {
            let formData=new FormData();

            console.log(this.image);

            formData.append('file',this.image)

            const { data: res } = await this.$http({
              url: 'utils/upload',
              method: 'post',
              data: formData,
              headers: { 'Content-Type': 'multipart/form-data'},
            })

            if(res.errno === 0){
              this.imageStr = res.data.url;
            }
            console.log(res);
          },

        async getCategories(){
                const { data: res} = await this.$http.get('category/getForumCategory');
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
              console.log(res);
              if(res.errno === 0){
                this.$refs.md.$img2Url(pos, res.data.url);
              }
            },
            // 所有操作都会被解析重新渲染
            change(value, render){
                // render 为 markdown 解析后的结果[html]
                this.html = render;
            },
            // 提交
            async submit(){
                const { data: res} = await this.$http.post('article/addForumArticle',{
                    title: this.title,
                    image: this.imageStr,
                    categoryId: this.category,
                    content: this.html,
                    describe: this.describe
                })
                console.log(res);
              if(res.errno === 0){
                  this.dialog = false;
                  this.$message.success('添加文章成功');
                  await this.$router.push('/addArticle');
              }else if(res.errno === 1000){
                await this.$router.push('/login');
                this.$message.error('登录过时，请重新登录');
              }else {
                this.$message.error('添加文章失败，请联系管理员');
              }

            },
            $imgDel(pos) {
              delete this.img_file[pos];
            }
        },
        components: {
            mavonEditor
        }
    }
</script>

<style scoped>

</style>