<!--
 * @Author: your name
 * @Date: 2020-03-22 11:39:30
 * @LastEditTime: 2020-03-28 22:28:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\DeliveryFeedback\index.vue
 -->
<template>
  <div class="wrapper">
    <div class="search-screen">
      <el-form :inline="true" :model="studentSearch" class="demo-form-inline">
        <el-form-item label="专业">
          <el-input v-model="studentSearch.major" placeholder="输入专业"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="studentSearch.sex" placeholder="输入性别"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--已就业信息 -->
    <div class="delivery-info">
      <el-table class="job-table" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="student_name" label="姓名" width="180" align="center">
        </el-table-column>
        <el-table-column prop="student_id" label="学号" align="center">
        </el-table-column>
        <el-table-column prop="major" label="专业" align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center">
        </el-table-column>
        <el-table-column prop="company_name" label="公司名称" align="center">
        </el-table-column>
        <el-table-column prop="job_name" label="职位" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="allJobDataCount">
      </el-pagination>
    </div>
    <!-- 弹框 -->

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
        userid: '',
        nowPage: 1,
        pageCount: 5,
        currentPage:1,
        allJobDataCount:0,
        studentSearch: {
          major: '',
          sex: '',
        }
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getEntryStudentByPage();
      this.getEntryStudentCount();
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      searchBtn() {
          this.getEntryStudentByPage();
          this.getEntryStudentCount();
      },
      getEntryStudentCount(){
          this.$ajax({
          method: 'post',
          url: 'getEntryStudentCount',
          data: {
            ...this.studentSearch,
          }
        }).then((res) => {
            this.allJobDataCount = res.data[0]['count(1)']
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      getEntryStudentByPage() {
        this.$ajax({
          method: 'post',
          url: 'getEntryStudentByPage',
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
       handleSizeChange(e) {
        this.pageCount = e;
        this.nowPage = 1;
        this.getEntryStudentByPage();
      },
      handleCurrentChange(e) {
        this.nowPage = e;
        this.getEntryStudentByPage();
      },



    },
  }
</script>

<style style="text/less"  lang="less"  scoped>
  .wrapper {
    height: 100%;
    overflow: auto;

    .delivery-info {
      .job-table {
        margin-bottom: 20px;
      }

      .block {
        text-align: center;

        span,
        ul li {
          font-size: 16px !important;

        }
      }


    }
    .block{
        margin-top:20px;
        margin:0 auto;
        text-align: center;
    }
  }
</style>