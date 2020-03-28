<!--
 * @Author: your name
 * @Date: 2020-03-28 13:28:08
 * @LastEditTime: 2020-03-28 13:43:34
 * @LastEditors: Please set LastEditors
 * @Description: 已入职
 * @FilePath: \毕业设计\client\src\views\aleadyEntryJob\index.vue
 -->

<template>
  <div class="wrapper">
    <!-- 投递反馈信息 -->
    <div class="delivery-info">
      <el-table class="job-table" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="student_name" label="姓名" width="180" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column prop="job_name" label="入职岗位" align="center">
        </el-table-column>
      </el-table>
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
        userid: '',
      }
    },
    computed: {},
    watch: {},
    created() { 
      this.getEnetryJob(); //获取已入职列表
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      getEnetryJob() {
        this.$ajax({
          method: 'post',
          url: 'getEnetryJobByCompanyId',
          data: {
            userid: this.$cookie.getCookie('userid')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            this.tableData = res.data;
            console.log(res)
          }
        }, (err) => {
          this.$message.error('服务器开小差');
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