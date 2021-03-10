<template>
  <div>
    <v-row>
      <v-col cols="5" class="col-xs-12">
        <v-file-input
            v-model="img"
            show-size
            counter
            label="上传PDF电子发票和支付截图"
            @change="upload()"
            @click:clear="clearImg()"
        ></v-file-input>
      </v-col>
      <v-col cols="3" class="col-xs-12">
        <v-text-field
            v-model="name"
            label="姓名"
        ></v-text-field>
      </v-col>
      <v-col cols="3" class="col-xs-12">
        <v-btn tile outlined color="success" class="btn" @click="submit">
          上传
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="mh-300">
      <v-card-title>
        我的发票
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
      >
        <!--<template v-slot:item.image = "{ item }">
          <a target="_blank" :href="item.image">点击查看</a>
        </template>
        <template v-slot:item.jtImage = "{ item }">
          <a target="_blank" :href="item.jtImage">点击查看</a>
        </template>-->
        <template v-slot:item.status = "{ item }">
          <div>
            <v-chip
                class="ma-2"
                color="primary"
                label
                text-color="white"
                v-if="item.status === '未报销'"
            >
              {{item.status}}
            </v-chip>
            <v-chip
                class="ma-2"
                color="orange"
                label
                text-color="white"
                v-if="item.status === '待返现'"
            >
              {{item.status}}
            </v-chip>
            <v-chip
                class="ma-2"
                color="green"
                label
                text-color="white"
                v-if="item.status === '已完成'"
            >
              {{item.status}}
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "MyPDF",
  data(){
    return{
      name:'',
      img:null,
      imgs:[],
      search: '',
      headers: [
        {
          text: '日期',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: '姓名', value: 'who' },
        { text: '物品类别和名字', value: 'item' },
        { text: '价格', value: 'money' },
        { text: '发票代码', value: 'code' },
        { text: '发票号码', value: 'no'},
/*        { text: '发票pdf', value: 'image' },
        { text: '支付截图', value: 'jtImage' },*/
        { text: '发票状态', value: 'status',align: 'center' },
      ],
      desserts: [],
    }
  },
  created() {
    this.getMessage();
  },
  methods:{
    async getMessage(){
      const res = await this.$http1.get('all');
      console.log(res);
      if(res.status === 200){
        let name = localStorage.getItem('name');
         this.desserts = [];
         res.data.forEach(item => {
           if (item.who === name) {
             this.desserts.push(item);
           }
        });
        console.log(this.desserts);

      }else if(res.errno === 1000){
        await this.$router.push('/login');
      }else {
        this.$message.error("获取信息失败，请联系管理员");
      }
      console.log(res);
    },
    upload(){
      console.log(111,this.imgs);
      if(this.img){
        if(this.imgs.length <= 1){
          this.imgs.push(this.img);
        }else{
          this.$message.error("只能上传pdf和支付截图两个文件");
        }
      }
    },
    clearImg(){
      this.imgs.splice(this.imgs.length - 1,1);
      console.log(222,this.imgs);
      this.$message.success("图片取消成功");
    },
    async submit(){
      if(this.name !== '' && this.imgs.length === 2){
        let formData = new FormData();
        this.imgs.forEach(item => {
          formData.append('file',item);
        })
        const {data: res} = await this.$http1({
          method:"POST",
          url: `check_invoice/${this.name}`,
          data: formData
        })
        console.log(res);
        if(res.errCode === 0){
            const { data: result } = await this.$http.post('pdf/add',{
              title: res.name,
              money: res.money,
              pdfCode: res.code,
              image: res.pic_path,
              pdf: res.pdf_path
            })
            console.log(result);
            if(result.errno === 0){
              this.$message.success("上传发票成功");
              await this.getMessage();
            }
        }else {
          this.$message.error("上传文件失败，请查看文件格式，或者联系管理员");
        }
      }else{
        this.$message.error("姓名为空或者文件不全，需要pdf文件以及支付截图");
      }
    },

  }
}
</script>

<style scoped>
  .btn{
    width: 120px;
    margin-top: 15px;
  }
</style>