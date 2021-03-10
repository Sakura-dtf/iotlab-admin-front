<template>
        <v-card>
        <v-stepper v-model="e6" vertical>
            <v-stepper-step :complete="e6 > 1" step="1">
                基本信息
            </v-stepper-step>

            <v-stepper-content step="1">
                <v-row>
                    <v-col cols="3" class="col-xs-12">
                    <v-avatar color="orange" tile size="150">
                      <img
                          :src="paymentStr !== '' ? paymentStr : require('../assets/images/avatar.jpg')"
                          alt="付款码"
                      >
                    </v-avatar>
                    </v-col>
                    <v-col cols="3" class="col-xs-12">
                        <v-avatar color="orange" size="150">
                            <img
                                    :src="avatarStr !== '' ? avatarStr : require('../assets/images/avatar.jpg')"
                                    alt="头像"
                            >
                        </v-avatar>
                    </v-col>
                    <v-col cols="5" class="col-xs-12">
                        <v-file-input
                          v-model="payment"
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Pick an image"
                          show-size
                          prepend-icon="mdi-camera"
                          @change="uploadFile1"
                          label="付款码">
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

                        <v-text-field v-model="username" label="用户名" :rules="nameRules" hide-details="auto"></v-text-field>
                        <v-text-field v-model="name" label="姓名" :rules="usernameRules" hide-details="auto"></v-text-field>
                    </v-col>
                </v-row>
                <v-btn color="primary" class="mgt-20" @click="setUser">下一步</v-btn>
                <v-btn class="mgt-20" text>上一步</v-btn>

            </v-stepper-content>

            <v-stepper-step :complete="e6 > 2" step="2">简介，写一篇文章介绍自己</v-stepper-step>

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
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: "EditUser",
        data: () => ({
            avatarStr: '',
            avatar: null,
            paymentStr: '',
            payment: null,
            e6: 1,
            username: '',
            name: '',
            password: null,
            nameRules: [
                value => !!value || 'Required.',
            ],
            usernameRules: [
                value => !!value || 'Required.',
            ],
            passwordRules: [
                value => !!value || 'Required.',
            ],
            content: '',
            cssFlag: true,
            sty1: "min-height: 420px; z-index: 0",
            sty2: "min-height: 420px; z-index: 1500",
            html: '',
        }),
      created() {
        this.getUserInfo();
        this.getUserArticle();
      },
      methods: {
            async uploadFile() {
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
              }else if(res.errno === 1000){
                await this.$router.push('/login');
                this.$message.error('登录过时，请重新登录');
              }else {
                this.$message.error('上传失败，请联系管理员');
              }

            },
            async uploadFile1() {
              let formData=new FormData();
              formData.append('file',this.payment)
              const { data: res } = await this.$http({
                url: 'utils/upload',
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data'},
              })

              if(res.errno === 0){
                this.paymentStr = res.data.url;
                this.$message.success("上传图片成功");
              }else if(res.errno === 1000){
                await this.$router.push('/login');
                this.$message.error('登录过时，请重新登录');
              }else {
                this.$message.error('上传失败，请联系管理员');
              }

            },
            async submit(){
              console.log(222);
              console.log(this.name);
                const {data: res} = await this.$http.post('user/loginUpdateUserArticle',{
                    content: this.html,
                    title: this.name,
                    userId: parseInt(this.$route.query.id)
                })
              console.log(res);
              if(res.errno === 0){
                this.$message.success('修改用户信息成功');
                await this.$router.push('/person');
                await this.getUserInfo();
              }else if(res.errno === 1000){
                await this.$router.push('/login');
                this.$message.error('登录过时，请重新登录');
              }else{
                this.$message.error('修改用户失败，请联系管理员');
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
              }else if(res.errno === 1000){
                await this.$router.push('/login');
                this.$message.error('登录过时，请重新登录');
              }else {
                this.$message.error('上传失败，请联系管理员');
              }

            },
            $imgDel(pos) {
              delete this.img_file[pos];
            },
            async setUser(){
              const {data: res} = await this.$http.post('user/updateUser',{
                  name: this.name,
                  username: this.username,
                  avatar: this.avatarStr,
                  payment: this.paymentStr,
                  userId: parseInt(this.$route.query.id)
              })

              if(res.errno === 0){
                this.e6 = 2;
              }else if(res.errno === 1000){
                //this.$router.push('/login');
                this.$message.error('登录超时，请重新登录');
              }else{
                this.$message.error('修改用户信息失败，请联系管理员')
              }
            },

            // 所有操作都会被解析重新渲染
            change(value, render){
                // render 为 markdown 解析后的结果[html]
                this.html = render;
            },
            async getUserInfo(){
              const {data : res} = await this.$http.get('user/getOneUser',{
                params: {
                  userId: parseInt(this.$route.query.id)
                }
              })
              console.log(res);
              if(res.errno === 0){
                  if(res.data.avatar){
                    this.avatarStr = res.data.avatar;
                  }
                  if(res.data.payment){
                    this.paymentStr = res.data.payment;
                  }
                  this.name =res.data.name;
                  this.username = res.data.username;
                  this.password = res.data.password;
              }else if(res.errno === 1000){
                await this.$router.push('/login');
                this.$message.error('登录过时，请重新登录');
              }else {
                this.$message.error('获取信息失败')
              }
            },
            async getUserArticle(){
              const {data : res} = await this.$http.get('user/getUserArticle',{
                params: {
                  userId: parseInt(this.$route.query.id)
                }
              })
              console.log(res);
              if(res.errno === 0){
                  this.content = res.data.content;
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