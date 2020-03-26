<!--
 * @Author: your name
 * @Date: 2020-03-26 12:49:59
 * @LastEditTime: 2020-03-26 20:05:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\userInfo\index.vue
 -->
<template>
  <div class="wrapper">
    <div class="job-info">
      <el-table class="job-table" :data="tableData" stripe style="width: 100%">

        <el-table-column prop="username" label="用户" width="180" align="center">
        </el-table-column>
        <el-table-column prop="user_id" label="账号" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column prop="status" label="身份" align="center">
        </el-table-column>
      </el-table>
      <!-- 分页插件 -->
      <!-- <div class="block">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="allJobDataCount">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props: {},
    data() {
      return {
        tableData: []
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getApplyUser() //获取用户的申请信息
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      getApplyUser() {
        this.$ajax({
          method: 'post',
          url: 'getAllUser',
          data: {}
        }).then((res) => {
            console.log(res);
            this.tableData = res.data
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      }
    },
  }
</script>

<style style="text/less"  lang="less"  scoped>
.wrapper{
    width:100%;
    height:100%;
    overflow: auto;
  }
</style>