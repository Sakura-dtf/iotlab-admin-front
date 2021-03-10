<template>
    <v-app id="inspire">
        <v-app id="inspire">
            <v-main>
                <v-container
                        class="fill-height"
                        fluid
                >
                    <v-row
                            align="center"
                            justify="center"
                    >
                        <v-col
                                cols="12"
                                sm="8"
                                md="4"
                        >
                            <v-card class="elevation-12">
                                <v-toolbar
                                        color="primary"
                                        dark
                                        flat
                                >
                                    <v-toolbar-title>后台登录</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn
                                                    :href="source"
                                                    icon
                                                    large
                                                    target="_blank"
                                                    v-on="on"
                                            >
                                                <v-icon>mdi-code-tags</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Source</span>
                                    </v-tooltip>
                                </v-toolbar>
                                <v-card-text>
                                    <v-form>
                                        <v-text-field
												                        v-model="username"
                                                label="用户名"
                                                name="login"
                                                prepend-icon="mdi-account"
                                                type="text"
                                        ></v-text-field>

                                        <v-text-field
												                        v-model="password"
                                                id="password"
                                                label="密码"
                                                name="password"
                                                prepend-icon="mdi-lock"
                                                type="password"
                                                @keyup.enter="submit"
                                        ></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" @click="submit">登录</v-btn>
                                    <v-btn color="primary" to="/register">注册</v-btn>
                                </v-card-actions>

                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-main>
        </v-app>
    </v-app>
</template>

<script>
    export default {
        name: "Login",
        data: () => ({
            source: '/',
            top: true,
			      username:'',
			      password:'',
            errorInfo: '登录失败，请查看你的用户名和密码',
        }),
      methods: {
        async submit(){
          const res = await this.$http.post('user/login',{
            username: this.username,
            password: this.password
          })
          console.log(res);
          if(res.data.errno === 0){
              //登录成功的处理
            console.log(res);
            let token = res.data.data.token;
            let name = res.data.data.name;
            window.localStorage.setItem('name',name);
            window.localStorage.setItem('token',token);
            this.$message.success("登录成功");
            await this.$router.push('/home');
          }else {
            this.$message.error("登录失败，用户名或者密码错误");
          }
        },
		}
  }
</script>

<style scoped>

</style>