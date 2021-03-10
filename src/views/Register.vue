<template>
    <div class="register-container">
        <v-card>
            <v-stepper v-model="e6">
                <v-stepper-header>
                    <v-stepper-step :complete="e6 > 1" step="1">基本信息</v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step :complete="e6 > 2" step="2">写一篇文章来介绍你自己吧</v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step :complete="e6 > 3" step="3">创建成功</v-stepper-step>
                </v-stepper-header>
                <v-stepper-content step="1" class="mh-450">
                    <v-row class="mgt-20">
                        <v-col cols="5" class="col-xs-12">
                            <v-avatar color="orange" size="250">
                                <img
                                        :src=" avatarStr  !== '' ? avatarStr  : require('../assets/images/avatar.jpg')"
                                        alt="头像"
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
                                    label="头像">
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
                            <v-form  ref="form">
                              <v-text-field v-model="username" label="用户名" :rules="nameRules" hide-details="auto"></v-text-field>
                              <v-text-field v-model="name" label="姓名" :rules="usernameRules" hide-details="auto"></v-text-field>
                              <v-text-field v-model="password" label="密码" type="password" :rules="passwordRules" hide-details="auto"></v-text-field>
                            </v-form>
                            </v-col>
                    </v-row>
                    <div class="btn-container">
                        <v-btn color="primary" class="mgt-20" @click="register">下一步</v-btn>
                        <v-btn class="mgt-20" text @click="toLogin">登录</v-btn>
                    </div>
                </v-stepper-content>
                <v-stepper-content step="2" class="mh-450">
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
                    <div class="btn-container">
                        <v-btn color="primary" class="mgt-20" @click="submit">创建</v-btn>
                        <v-btn class="mgt-20" @click="e6 = e6-1" text>上一步</v-btn>
                    </div>
                </v-stepper-content>
                <v-stepper-content step="3" class="mh-450">
                    <router-link to="/login">
                        <v-img src="../assets/images/welcome.png" alt="" height="520">

                        </v-img>
                    </router-link>
                </v-stepper-content>
            </v-stepper>
        </v-card>
    </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: "Register",
        data: () => ({
            name:'',
            username: '',
            password: '',
            avatarStr: '',
            e6: 1,
            avatar: {},
            nameRules: [
                value => !!value || 'Required.',
            ],
            usernameRules: [
                value => !!value || 'Required.',
            ],
            passwordRules: [
                value => !!value || 'Required.',
            ],
            userId: 0,
            userName: '',
            content: '',
            cssFlag: true,
            sty1: "min-height: 420px; z-index: 0",
            sty2: "min-height: 420px; z-index: 1500",
            html: '',
        }),
        methods: {
            toLogin(){
              this.$router.push('/login')
            },
            async submit(){
                const {data: res} = await this.$http.post('user/updateUserArticle',{
                  userId: this.userId,
                  content: this.content,
                })
              console.log(res);
                if(res.errno === 0){
                  this.e6 = 3;
                  this.$message.success('创建用户成功,点击图片可返回登录');
                }else {
                  this.$message.error('创建用户失败');
                }
            },
            async register(){
                if(this.$refs.form.validate()){
                  const { data: res } =await this.$http.post('user/addUser',{
                      name: this.name,
                      password: this.password,
                      username: this.username,
                      avatar: this.avatarStr
                  })
                  if(res.errno === 0){
                    this.userId = res.data.userId;
                    this.userName = res.data.name;

                    const { data : result } = await this.$http.post('article/addUserArticle',{
                      userId: this.userId,
                      content: this.html,
                      name: this.userName
                    })

                    if(result.errno === 0){
                        this.e6 = 2;
                    }else {
                        this.$message.error("创建用户有误，请联系管理员")
                    }
                  }else {
                       this.$message.error('创建用户失败，用户名可能重复');
                  }
                }else {
                     this.$message.error('数据输入有误');
                }
            },
            async uploadFile(){
              let formData=new FormData();
              formData.append('file',this.avatar)
              const { data: res } = await this.$http({
                url: 'utils/upload',
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data'},
              })

              if(res.errno === 0){
                this.avatarStr = res.data.url;
                this.$message.success("上传图片成功");
              }else if (res.errno === 1000){
                await this.$router.push('/login');
                this.$message.error('登录超时，请重新登录');
              }else {
                this.$message.error('上传失败，请联系管理员');
              }
            },
            readModel(){
                console.log(status,value);
                this.cssFlag = !this.cssFlag;
            },

            fullScreen(status,value){
                this.cssFlag = !this.cssFlag;
            },

            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file){
                let formdata = new FormData();

                this.$upload.post('/上传接口地址', formdata).then(res => {
                    console.log(res.data);
                    this.$refs.md.$img2Url(pos, res.data);
                }).catch(err => {
                    this.$message.error("上传图片失败，请联系管理员");
                })
            },
            $imgDel(pos) {
              delete this.img_file[pos];
            },
            // 所有操作都会被解析重新渲染
            change(value, render){
                // render 为 markdown 解析后的结果[html]
                this.html = render;
            },
        },
        components:{
            mavonEditor
        }
    }
</script>

<style scoped>
    .register-container{
        width: 80%;
        margin: 0 auto;
        padding-top: 50px;
    }
    .btn-container{
        display: flex;
        justify-content: center;
    }
</style>