<template>
    <v-card class="mh-500">
        <v-card-title>
            用户列表
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
                :items-per-page="6"
                item-key="id"
        >
            <template v-slot:item.avatar= "{ item }">
              <a :href="item.avatar" target="_blank">
                <v-img
                    contain
                    width="200"
                    :src="item.avatar"
                    :alt="item.name"
                    max-height="60px"
                />
              </a>

            </template>
            <template v-slot:item.auth = "{ item }">
                <v-switch v-model="item.auth" :label="item.auth ? '超级管理员' : '普通用户'" @click="setIsSuper(item.id,item.auth)" style="text-align: center"></v-switch>
            </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editUser(item.id)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteUser(item.id)"
            >
              mdi-delete
            </v-icon>
          </template>

        </v-data-table>
    </v-card>
</template>

<script>
    export default {
        name: "User",
        data: () => ({
            search: '',
            headers: [
                {
                    text: '用户名',
                    align: 'start',
                    sortable: false,
                    value: 'username',
                },
                { text: '姓名',  value: 'name',align: 'start'},
                { text: '头像',  value: 'avatar',sortable: false,align: 'center',width: '100px' },
                { text: '权限',  value: 'auth', width: '250px' },
                { text: '操作', value: 'actions', sortable: false },
            ],
            desserts: [],
        }),
        created(){
            this.getAllUser();
        },
        methods: {
            editUser(id){
              this.$router.push({path: '/editUser', query:{'id': id}})
            },
            async getAllUser(){
                const {data:res} = await this.$http.get('user/getAllUser');
                if(res.errno === 0){
                    this.desserts = [];
                    res.data.forEach( item => {
                        let temp = {
                            id: item.id,
                            name: item.name,
                            username: item.username,
                            avatar: item.avatar,
                            auth: item.isSuper === '1'
                        }
                        this.desserts.push(temp);
                    })
                }else if(res.errno === 1000){
                  await this.$router.push('/login');
                  this.$message.error('登录过时，请重新登录');
                }else {
                  this.$message.error("获取用户失败，请联系管理员");
                }
            },
            async deleteUser(id){
              const {data : res} = await this.$http.post('user/deleteUser',{
                userId: id,
              })
              if(res.errno === 0){
                this.$message.success("删除用户成功");
                await this.getAllUser();
              }else if(res.errno === 1000){
                await this.$router.push('/login');
                this.$message.error('登录过时，请重新登录');
              }else if(res.errno === 1021){
                this.$message.error("您不是管理员，您没有该权限");
                await this.getAllUser();
              }else{
                this.$message.error("删除用户失败,请确保该用户的文章,发票信息都被清楚");
              }
            },
            async getOneUser(data){
                if(data.value === true)
                {
                    const { data: res } = await this.$http.get('user/getUserArticle',{
                        params: {
                          userId: data.item.id
                        }
                    })
                    if(res.errno === 0){
                        data.item.content = res.data.content;
                        data.item.title = res.data.title;

                    }else if(res.errno === 1000){
                      await this.$router.push('/login');
                      this.$message.error('登录过时，请重新登录');
                    }
                }
            },
            async setIsSuper(id,isSuper){
                console.log(id,isSuper);
                const {data : res} = await this.$http.post('user/setAdminUser',{
                    userId: id,
                    isSuper: isSuper ? 1 : 0
                })
                if(res.errno === 0){
                    this.$message.success('修改用户权限成功');
                    await this.getAllUser();
                }else if(res.errno === 1000){
                  await this.$router.push('/login');
                  this.$message.error('登录过时，请重新登录');
                }else if(res.errno === 1021){
                  await this.getAllUser();
                  this.$message.error("您不是管理员，您没有该权限");
                }else{
                  await this.getAllUser();
                  this.$message.error("修改用户权限失败，请联系管理员");
                }
            },
            change(data){

            }
        }
    }
</script>

<style scoped>

</style>