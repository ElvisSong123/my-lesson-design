<!--
 * @Author: your name
 * @Date: 2020-03-26 15:17:10
 * @LastEditTime: 2020-03-26 15:21:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\404page\index.vue
 -->
<template>
  <div class="wrapper">
      <div class="remind">抱歉！您访问的页面不存在。。。</div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props: {},
    data() {
      return {

      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    beforeDestroy() {},
    methods: {

    },
  }
</script>

<style style="text/less"  lang="less"  scoped>
    .wrapper{
        width:100%;
        .remind{
            font-size: 30px;
            font-weight: bold;
            text-align:center;
            margin-top:100px;
        }
    }
</style>