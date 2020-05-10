<!--
 * @Author: your name
 * @Date: 2020-03-26 15:29:17
 * @LastEditTime: 2020-04-29 22:26:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\Candidate\index.vue
 -->
<template>
  <div class="wrapper">
    <!--条件筛选-->
    <div class="search-screen">
      <el-form :inline="true" :model="candidateSearch" class="demo-form-inline">
        <el-form-item label="投递职位">
          <el-input v-model="candidateSearch.jobName" clearable placeholder="输入投递职位"></el-input>
        </el-form-item>
        <el-form-item label="工作地点">
          <el-input v-model="candidateSearch.place" clearable placeholder="输入工作地点"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 候选人信息 -->
    <div class="candidate-info">
      <el-table class="job-table" :data="tableData" stripe style="width: 100%">

        <el-table-column label="候选人" width="180" align="center">
          <div class="company-name" slot-scope="{ row }" style="cursor:pointer" @click="openCandidateDetail(row.resume_data,row.user_id)">
            {{row.resume_data.operator}}
          </div>
        </el-table-column>
        <el-table-column prop="deliver_address" label="投递职位地点" align="center">
        </el-table-column>
        <el-table-column prop="deliver_jobname" label="投递职位" align="center">
        </el-table-column>
        <el-table-column prop="deliver_state" label="当前状态" align="center">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="{row}">
            <el-button type="success" @click="moveCandidateTo(row)">移动到</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页插件 -->
      <div class="block">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="allJobDataCount">
        </el-pagination>
      </div>
    </div>

    <!-- 抽屉弹框 -->
    <el-drawer :visible.sync="drawerCandidateVisible" :direction="direction" size="100%">
      <Candidate-deteil v-if="drawerCandidateVisible" :resumeData="resumedetail" :userid="userid"></Candidate-deteil>
    </el-drawer>

    <el-dialog title="移动候选人" :visible.sync="moveCndidateVisible" width="30%" center>
      <span slot="footer" class="dialog-footer">
        <el-select style="display:block;margin-bottom:20px" v-model="moveValue">
          <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="moveCndidateVisible = false">取 消</el-button>
        <el-button type="primary" @click="onMoveCandidate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import CandidateDeteil from './components/candidateDetail';
  import deepClone from '@/toolsFunc/deepClone.js'
  export default {
    name: "",
    components: {
      CandidateDeteil
    },
    props: {},
    data() {
      return {
        drawerCandidateVisible: false,
        moveCndidateVisible: false,
        candidateSearch: {
          jobName: '',
          place: ''
        },
        options: [{
          value: '初选通过'
        }, {
          value: '初试通过',
        }, {
          value: '复试通过',
        }, {
          value: '发放offer',
        }, {
          value: '进入人才库',
        }],
        moveValue: '',
        tableData: [],
        direction: 'ttb',
        nowPage: 1,
        pageCount: 5,
        currentPage: 1,
        allJobDataCount: 0,
        resumedetail: '',
        userid: '',
        moveUserId:'',
        moveJobId:'',
        moveCompanyName:'',
        moveJobName:'',
      }
    },
    computed: {},
    watch: {},
    created() {
      this.searchCandidateInfoByPage();
      this.getCandidateCount()
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      onMoveCandidate() {
        this.$ajax({
          method: 'post',
          url: 'changeCandidateState',
          data: {
            jobId:this.moveJobId,
            userId: this.moveUserId,
            state:this.moveValue,
            moveCompanyName:this.moveCompanyName,
            moveJobName:this.moveJobName
          }
        }).then((res) => {
          if (res) {
            this.moveCndidateVisible = false;
            this.searchCandidateInfoByPage();
          }
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      moveCandidateTo(row) { 
        console.log(row)
        this.moveCndidateVisible = true;
        this.moveJobId =  row.job_id;
        this.moveUserId = row.user_id;
        this.moveCompanyName = row.company_name;
        this.moveJobName = row.deliver_jobname;
      },

      searchBtn() {
        this.currentPage = 1;
        this.nowPage = 1;
        this.searchCandidateInfoByPage();
        this.getCandidateCount();
      },
      openCandidateDetail(data, userid) {
        this.resumedetail = data;
        this.drawerCandidateVisible = true;
        this.userid = userid
      },
      searchCandidateInfoByPage() {
        this.$ajax({
          method: 'post',
          url: 'searchCandidateInfo',
          data: {
            ...this.candidateSearch,
            nowPage: this.nowPage,
            pageCount: this.pageCount,
            userid: this.$cookie.getCookie('userid')
          }
        }).then((res) => {
          if (res) {
            if (res.data) {
              res = res.data.map((ele, index) => {
                let resume_data = JSON.parse(ele.resume_data);
                return { ...ele, resume_data }
              });
            }
            this.tableData = res;
            console.log(res)
          }
        }, (err) => {
          this.$message.error('服务器开小差');
        })


      },
      async getCandidateCount() {
        let allJobDataCount = await this.getData('searchCandidateCount', {
          ...this.candidateSearch,
          userid: this.$cookie.getCookie('userid')
        });
        this.allJobDataCount = allJobDataCount.data[0]['count(1)']
      },
      handleSizeChange(e) {
        this.pageCount = e;
        this.nowPage = 1;
        this.currentPage = 1;
        this.searchCandidateInfoByPage();
      },
      handleCurrentChange(e) {
        this.nowPage = e;
        this.searchCandidateInfoByPage();
      },
      getData(url, data, userid = '') {
        return this.$ajax({
          method: 'post',
          url,
          data
        })
      },

    },
  }
</script>

<style style="text/less"  lang="less"  scoped>
  .wrapper {
    height: 100%;
    

    .candidate-info {
      height:85%;
      overflow: auto;
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
  }
</style>