<!--
 * @Author: your name
 * @Date: 2020-03-22 11:39:30
 * @LastEditTime: 2020-04-27 23:01:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\DeliveryFeedback\index.vue
 -->
<template>
  <div class="wrapper">
    <div class="search-screen">
      <el-form :inline="true" :model="studentSearch" class="demo-form-inline">
        <el-form-item label="专业">
          <el-input v-model="studentSearch.major" placeholder="输入专业" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="studentSearch.sex" label="男">男</el-radio>
          <el-radio v-model="studentSearch.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="precent">
        <span style="margin-right:10px">已就业人数：{{allJobDataCount}}</span>
        <span style="margin:0 5px;color:#aaa">|</span>
        <span style="margin-right:10px"> 学生总人数：{{allStudent}}</span>
        <span style="margin:0 5px;color:#aaa">|</span>
        就业率：{{(allJobDataCount / allStudent).toFixed(2) * 100 }} %
      </div>
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
        currentPage: 1,
        allJobDataCount: 0,
        allJobStudent: 0,
        allStudent: 0,
        isSearchBySex:false,
        isSearchByMajor:false,
        studentSearch: {
          major: '',
          sex: '',
        }
      }
    },
    computed: {
      turnSex(){
        if(this.studentSearch.sex && this.studentSearch.sex == "男"){
          return '1'
        }else if(this.studentSearch.sex && this.studentSearch.sex == "女"){
          return '0'
        }else {
          return ''
        }
      }
    },
    watch: {},
    created() {
      this.getEntryStudentByPage();
      this.getEntryStudentCount(this.studentSearch, (res) => {this.allJobDataCount = res.data[0]['count(1)']});
      // this.getAllJobStudent(); //获取已入职学生总数
      this.getAllStudentCount() //获取注册学生总数
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      searchBtn() {
        this.getEntryStudentByPage();
        this.getEntryStudentCount(this.studentSearch, (res) => { this.allJobDataCount = res.data[0]['count(1)'] });
        this.getAllStudentCount();
        this.isSearchBySex = true;
        this.isSearchByMajor = true;
      },
      // getAllJobStudent() {
      //   this.getEntryStudentCount({ major: '', sex: '' }, (res) => { this.allJobStudent = res.data[0]['count(1)'] });
      // },
      getAllStudentCount() {
        this.$ajax({
          method: 'post',
          url: 'getAllStudentCount',
          data: {
            sex:this.turnSex,
            major:this.studentSearch.major
          }
        }).then((res) => {
          this.allStudent = res.data[0]['count(1)']
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      getEntryStudentCount(data, callback) {
        this.$ajax({
          method: 'post',
          url: 'getEntryStudentCount',
          data: {
            ...data,
          }
        }).then((res) => {
          callback(res)
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

    .search-screen {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

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

    .block {
      margin-top: 20px;
      margin: 0 auto;
      text-align: center;
    }
  }
</style>