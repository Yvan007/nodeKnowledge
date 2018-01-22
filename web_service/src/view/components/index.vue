<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <router-view/>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <button v-on:click="login">登录</button>
    <!--<button v-if="this.isShow()"> 行业专家 </button>-->
    <button v-if="this.KNOS.API.showExpert"> 行业专家 </button>
    <button v-if="this.KNOS.API.showExpert||this.KNOS.API.showManager"> 行业专家 || manager </button>
    <button v-if="this.KNOS.API.showManager"> manager </button>
    <button v-if="this.KNOS.API.showData"> data </button>
    <button v-if="this.KNOS.API.showAdmin"> admin </button>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      this.KNOS.API.getUserInfo()
      return {
        msg: '我是index',
        data: this.data,
        manager: this.manager
      }
    },
    methods: {
      login: function () {
        console.log(this.KNOS)
//        console.log(this.KNOS.PORT)
//        console.log(this.KNOS.API)
//        console.log(this.KNOS.API.getUserInfo())
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
