<!--
 * @Author: your name
 * @Date: 2020-03-22 11:39:30
 * @LastEditTime: 2020-03-28 20:57:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\DeliveryFeedback\index.vue
 -->
<!--
 * @Author: your name
 * @Date: 2020-03-26 15:29:17
 * @LastEditTime: 2020-03-27 20:06:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\Candidate\index.vue
 -->
<template>
  <div class="wrapper">
    <!-- 投递反馈信息 -->
    <div class="delivery-info">
      <el-table class="job-table" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="company_name" label="投递公司" width="180" align="center">
        </el-table-column>
        <el-table-column prop="deliver_jobname" label="投递职位" align="center">
        </el-table-column>
        <el-table-column prop="deliver_address" label="工作地点" align="center">
        </el-table-column>
        <el-table-column prop="deliver_state" label="投递状态" align="center">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="{row}">
            <el-button type="success" v-if="!aleardyChooseCompany&&row.deliver_state == '发放offer'" @click="openConfirmJobVisible(row)">确认入职</el-button>
            <el-button type="info" disabled v-else-if="aleardyChooseCompany&&aleardyChooseCompany != row.job_id &&row.deliver_state == '发放offer'">确认入职</el-button>
            <el-button type="success" disabled v-else-if="aleardyChooseCompany&&aleardyChooseCompany == row.job_id && row.deliver_state == '发放offer'">已经入职</el-button>
            <el-button type="info" disabled v-else>等待入职通知</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹框 -->
    <el-dialog title="确认入职" :visible.sync="confirmJobVisible" width="30%" center>
      <span>确认入职该企业?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deliverJobVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirmJob">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props: {},
    data() {
      return {
        confirmJobVisible: false,
        tableData: [],
        userid: '',
        confirmData: '',
        aleardyChooseCompany: false
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getDeliverFeedback(); //获取投递职位列表
      this.getEnetryJob(); //获取已入职公司
      this.getResumeData()
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      getDeliverFeedback() {
        this.$ajax({
          method: 'post',
          url: 'getDeliverFeedback',
          data: {
            userid: this.$cookie.getCookie('userid')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            console.log(res);
            this.tableData = res.data
          }
        }, (err) => {
          this.$message.error('服务器开小差');
        })


      },
      async onConfirmJob() {
        this.confirmJobVisible = false;
        let resume = await this.getResumeData();
        let sex = JSON.parse(resume.data.personinfo).sex;
        let major = JSON.parse(resume.data.educationinfo).major;
        console.log(resume)
        this.$ajax({
          method: 'post',
          url: 'confirmEnetryJob',
          data: {
            ...this.confirmData,
            userid: this.$cookie.getCookie('userid'),
            sex:sex?'女':'男',
            major
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            this.$showMessage('保存成功', 'success');
            this.getEnetryJob();
          }else{
            this.$showMessage('您已有了入职信息，请勿重复操作', 'error');
          }
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      openConfirmJobVisible(data) {
        this.confirmJobVisible = true;
        this.confirmData = data;
      },
      getEnetryJob() {
        this.$ajax({
          method: 'post',
          url: 'getEnetryJob',
          data: {
            userid: this.$cookie.getCookie('userid')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            this.aleardyChooseCompany = res.data[0].job_id;
            console.log(this.aleardyChooseCompany)
          }
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      getResumeData(){
       return this.$ajax({
          method: 'post',
          url: 'getResumeData',
          data: { 
            userid: this.$cookie.getCookie('userid')
          }
        })
      }

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
  }
</style>