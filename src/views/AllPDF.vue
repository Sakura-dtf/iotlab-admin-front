<template>
  <v-card class="mh-500">
    <v-card-title>
      所有发票
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
      <template v-slot:item.image = "{ item }">
        <a target="_blank" :href="item.image">点击查看</a>
      </template>
      <template v-slot:item.jtImage = "{ item }">
        <a target="_blank" :href="item.jtImage">点击查看</a>
      </template>
      <template v-slot:item.isZT = "{ item }">
        <div>{{item.isZT === '0' ? "未报销" : "已报销"}}</div>
      </template>
    </v-data-table>
  </v-card>

</template>

<script>
export default {
  name: "AllPdf",
  data(){
    return{
      search: '',
      headers: [
        {
          text: '日期',
          align: 'start',
          sortable: true,
          value: 'createdAt',
        },
        { text: '姓名', value: 'name' },
        { text: '物品类别和名字', value: 'title' },
        { text: '价格', value: 'money' },
        { text: '发票代码', value: 'pdfCode' },
        { text: '发票号码', value: 'pdfId'},
        { text: '发票pdf', value: 'image' },
        { text: '支付截图', value: 'jtImage' },
        { text: '发票状态', value: 'isZT' },
      ],
      desserts: [],
    }
  },
  created() {
    this.getMessage();
  },
  methods:{
    async getMessage(){
      const {data: res} = await this.$http.get('pdf/getMyPdf');
      if(res.errno === 0){
        this.desserts = res.data;
      }else if(res.errno === 1000){
        await this.$router.push('/login');
        this.$message.error('登录过时，请重新登录');
      }else {
        this.$message.error("获取信息失败，请联系管理员");
      }
      console.log(res);
    },
  }
}
</script>

<style scoped>

</style>