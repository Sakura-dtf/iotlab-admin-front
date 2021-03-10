<template>
  <v-card class="mh-500">
    <v-card-title>
      <v-btn color="primary" @click="goToDialog">上传图片</v-btn>
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
        class="elevation-1"
    >
      <template v-slot:item.image="{ item }">
        <a :href="item.image" target="_blank" class="hidden">{{item.image}}</a>
      </template>

      <template v-slot:item.imageItem= "{ item }">
        <div>
          <v-img
              style="margin: 0 auto; border-radius: 50%"
              max-width="300px"
              contain
              :src="item.image"
              :alt="item.title"
              max-height="58px"
          />
        </div>
      </template>

      <template v-slot:item.isLBT="{ item }">
        <v-switch v-model="item.isLBT" :label="isLBT ? '轮播图' : '非轮播图' " @change="setLBT(item)"></v-switch>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline" @click="goToDialog">上传图片</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-file-input
                      :rules="imageRules"
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
                  <v-text-field label="图片介绍" :rules="titleRules" hide-details="auto" v-model="title">

                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-switch v-model="isLBT" :label="isLBT ? '轮播图' : '不是轮播图' "></v-switch>
                </v-col>
              </v-row>
            </v-form>

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
export default {
  name: "photo",
  data(){
    return{
      describe: '',
      isLBT:false,
      title: '',
      image:null,
      imageStr: '',
      dialog: false,
      search:'',
      imageRules: [
        value => !!value || 'Required.',
      ],
      titleRules: [
        value => !!value || 'Required.',
      ],
      headers: [
        {
          text: '图片介绍',
          align: 'start',
          sortable: true,
          value: 'title',
          width: '150px'
        },
        { text: '图片地址', value: 'image',width: '300px' },
        { text: '是否轮播图', value: 'isLBT',width: '150px' },
        { text: '图片', value: 'imageItem',align: 'center' ,width: '150px'},
        { text: '操作', value: 'actions',align: 'center', sortable: false,width: '100px' },
      ],
      desserts: []
    }
  },
  created() {
    this.getAllPhoto();
  },
  methods: {
    goToDialog() {
      this.dialog = true;
    },

    async getAllPhoto(){
      const {data: res} = await this.$http.get('photo/getAllPhoto');
      console.log(res);
      if(res.errno === 0){
        this.desserts = res.data.map( item => {
          item.isLBT = item.isLBT ==='0';
          return item;
        })
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else if(res.errno === 1021){
        this.$message.error("您不是管理员，您没有该权限");
        await this.getAllPhoto();
      }else {
        this.$message.error('获取图片列表失败');
      }

    },

    async uploadFile(){
      let formData=new FormData();
      formData.append('file',this.image)
      const { data: res } = await this.$http({
        url: 'utils/upload',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data'},
      })
      if(res.errno === 0){
        this.imageStr = res.data.url;
        this.$message.success("上传图片成功");
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else {
        this.$message.error('上传失败，请联系管理员');
      }
    },

    async deleteItem(item) {
      const {data: res} = await this.$http.post('photo/delete',{
        id: item.id,
      });
      if(res.errno === 0){
        await this.getAllPhoto();
        this.$message.success("图片删除成功");
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else if(res.errno === 1021){
        this.$message.error("您不是管理员，您没有该权限");
        await this.getAllPhoto();
      }else {
        this.$message.error('图片状态修改失败，请联系管理员');
      }
    },
    async submit() {
      if(this.$refs.form.validate()){
        const {data: res} = await this.$http.post('photo/add',{
          title: this.title,
          image: this.imageStr,
          isLBT:this.isLBT
        });
        console.log(res);
        if(res.errno === 0){
          this.$message.success("上传图片成功");
          await this.getAllPhoto();
          this.$refs.form.reset();
        }else if(res.errno === 1000){
          await this.$router.push('/login');
          this.$message.error('登录过时，请重新登录');
        }else if(res.errno === 1021){
          this.$message.error("您不是管理员，您没有该权限");
          await this.getAllPhoto();
        }else {
          this.$message.error('上传图片失败，请联系管理员');
        }
        this.dialog = false;
      }
    },
    async setLBT(item){
      console.log(item);
      const {data: res} = await this.$http.post('photo/modifyLBT',{
        id: item.id,
        isLBT: item.isLBT
      });
      console.log(res);
      if(res.errno === 0){
        this.$message.success("图片状态修改成功");
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else if(res.errno === 1021){
        this.$message.error("您不是管理员，您没有该权限");
        await this.getAllPhoto();
      }else {
        this.$message.error('图片状态修改失败，请联系管理员');
      }
    }
  }
}
</script>

<style scoped>
  a{
    display: block;
    cursor: pointer;
    width: 300px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }
</style>