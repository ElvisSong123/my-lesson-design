<!--
 * @Author: your name
 * @Date: 2020-03-26 12:49:59
 * @LastEditTime: 2020-04-29 22:23:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\userInfo\index.vue
 -->
<template>
  <div class="wrapper">
    <div class="search-screen">
      <el-form :inline="true" :model="studentSearch" class="demo-form-inline">
        <el-form-item label="专业">
          <el-input v-model="studentSearch.major" placeholder="输入专业" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户身份">
          <el-select v-model="studentSearch.statusValue" placeholder="请选择">
            <el-option label="学生" value="学生"></el-option>
            <el-option label="企业用户" value="企业用户"></el-option>
            <el-option label="老师" value="老师"></el-option>
            <el-option label="全部" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">查询</el-button>
        </el-form-item>
      </el-form>

    </div>
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
      <div class="block">
        <el-pagination background @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" :current-page.sync="currentPage" 
        :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" 
        :total="allDataCount">
        </el-pagination>
      </div>
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
        tableData: [],
        studentSearch: {
          major: '',
          statusValue: '',
        },
        currentPage: 1,
        allDataCount: 0,
        nowPage: 1,
        pageCount: 5
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getApplyUser() //获取用户的申请信息
      this.getApplyUserCount()
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      getApplyUser() {
        this.$ajax({
          method: 'post',
          url: 'getAllUser',
          data: {
            ...this.studentSearch,
            nowPage: this.nowPage,
            pageCount: this.pageCount
          }
        }).then((res) => {
          console.log(res);
          this.tableData = res.data
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      getApplyUserCount() {
        this.$ajax({
          method: 'post',
          url: 'getAllUserCount',
          data: {
            ...this.studentSearch,
          }
        }).then((res) => {
          console.log(res);
          this.allDataCount = res.data[0]['count(1)']
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      searchBtn() {
        this.nowPage = 1;
        this.currentPage = 1;
        this.getApplyUser();
        this.getApplyUserCount()
      },
      handleSizeChange(e) {
        this.pageCount = e;
        this.nowPage = 1;
        this.currentPage = 1;
        this.getApplyUser();
      },
      handleCurrentChange(e) {
        this.nowPage = e;
        this.getApplyUser();
        this.getApplyUserCount();
      },

    },
  }
</script>

<style style="text/less"  lang="less"  scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;

    .block {
      margin: 20px auto 0px;
      text-align: center;
    }
  }
</style>