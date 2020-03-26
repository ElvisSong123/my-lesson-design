<template>
  <div class="job-wrapper">
    <!--条件筛选-->
    <div class="search-screen">
      <el-form :inline="true" :model="jobSearch" class="demo-form-inline">
        <el-form-item label="公司地点">
          <el-input v-model="jobSearch.place" placeholder="输入公司/地点"></el-input>
        </el-form-item>
        <el-form-item label="职位搜索">
          <el-input v-model="jobSearch.job" placeholder="输入职位"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 职位信息 -->
    <div class="job-info">
      <el-table class="job-table" :data="tableData" stripe style="width: 100%">

        <el-table-column label="公司名称" width="180" align="center">
          <div class="company-name" slot-scope="{ row }" style="cursor:pointer" @click="openCompanyDetail(row.corp_id)">
            {{row.name}}
          </div>
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center">
        </el-table-column>
        <el-table-column prop="finance" label="融资情况" align="center">
        </el-table-column>
        <el-table-column prop="field" label="行业领域" align="center">
        </el-table-column>
        <el-table-column label="在招职位" align="center">
          <div class="company-name" slot-scope="{ row }" style="cursor:pointer" @click="openJobDetail(row.job_id)">
            {{row.jobName}}
          </div>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <el-button type="success">投递</el-button>
        </el-table-column>
      </el-table>
      <!-- 分页插件 -->
      <div class="block">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="allJobDataCount">
        </el-pagination>
      </div>
    </div>

    <!-- 抽屉弹框 -->
    <el-drawer :visible.sync="drawerCompanyVisible" :direction="direction" size="100%">
      <div slot="title" style="font-size:20px">公司详情</div>
      <div class="content">
        <div class="company-logo">
          <div class="background">
            <img :src=companyAvatar alt="">
            <div class="right">
              <div class="name">{{companyIntroduce.name}}</div>
              <div class="signWord">{{companyIntroduce.slogan}}</div>
            </div>
          </div>
        </div>
        <div class="company-introduce">
          <div class="left">
            <div class="introduce">
              <div class="title">公司介绍</div>
              <div class="content">{{companyIntroduce.introduce}}</div>
            </div>

            <div class="info">
              <div class="title">基本信息</div>
              <div class="content">
                <p>
                  <i class="type"></i>
                  {{companyIntroduce.field}}
                </p>
                <p>
                  <i class="money"></i>
                  {{companyIntroduce.finance}}
                </p>
                <p>
                  <i class="people-count"></i>
                  {{companyIntroduce.scale}}
                </p>
                <p>
                  <i class="address"></i>
                  {{companyIntroduce.address}}
                </p>
              </div>
            </div>

          </div>
          <div class="right">
            <div class="develop">
              <div class="title" style="margin-bottom:20px">发展历程</div>
              <div class="block">
                <el-timeline>
                  <el-timeline-item v-for="(activity, index) in companyDevelop" :key="index" :icon="activity.icon" :type="activity.type" color="#0bbd87" :size="activity.size" :timestamp="activity.time">
                    {{activity.event}}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </div>
        </div>
        <div class="company-img">
          <div class="title">企业文化</div>
          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="item in imgUrlArr" :key="item">
              <img style="width:100%;height:100%" :src=item alt="">
            </el-carousel-item>
          </el-carousel>
        </div>

      </div>
    </el-drawer>

    <el-drawer class="job-drawer" :visible.sync="drawerJobVisible" :direction="direction" size="100%">
      <div slot="title" style="font-size:20px">职位详情</div>
      <div class="content">
        <div class="header">
          {{jobDetailData.jobName}}（{{jobDetailData.address}}）
          <span>{{jobDetailData.money}}</span>
        </div>
        <div class="body">
          <div class="job-detail">
            <p>职位描述</p>
            {{jobDetailData.jobDescribe}}
          </div>
          <div class="job-require">
            <p>岗位要求</p>
            {{jobDetailData.jobRequire}}
          </div>
        </div>
      </div>
    </el-drawer>
  </div>

</template>

<script>
  export default {
    name: "",
    components: {},
    props: {},
    data() {
      return {
        nowPage: 1,
        pageCount: 5,
        companyAvatar:'',
        allJobDataCount: 0,
        jobDetailData: {},
        drawerJobVisible: false,
        drawerCompanyVisible: false,
        companyIntroduce: '',
        companyDevelop: '',
        direction: 'ttb',
        currentPage: 1,
        jobSearch: {
          place: '',
          financ: '',
          job: ''
        },
        imgUrlArr: [],
        tableData: [],
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getJobData();
      this.getJobCount();
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      async getJobCount() {
        let allJobDataCount = await this.getData('getJobDataCount');
        this.allJobDataCount = allJobDataCount.data[0]['count(1)']
      },
      handleSizeChange(e) {
        this.pageCount = e;
        this.nowPage = 1;
        this.getJobData();
      },
      handleCurrentChange(e) {
        this.nowPage = e;
        this.getJobData();
      },
      /**
       * @description: 打开公司详情弹窗
       * @param {type} 
       * @return: 
       */
      openCompanyDetail(corpId) {

        this.drawerCompanyVisible = true;
        this.getCompanyImg(corpId);
        this.getCompanyInfo(corpId);
      },
      /**
       * @description: 打开职位详情弹窗
       * @param {type} 
       * @return: 
       */
      openJobDetail(jobId) {
        this.drawerJobVisible = true;
        console.log(jobId);
        this.jobDetailData = this.tableData.filter((ele) => {
          return ele.job_id == jobId
        })[0]
        console.log(this.jobDetailData, '1234')
      },
      getCompanyImg(corpId) {
        this.imgUrlArr = [];
        this.$ajax({
          method: 'post',
          url: `getCompanyImg?userid=${corpId}`,
        }).then((res) => {
          if (res) {
            this.imgUrlArr = res.filter(ele=>!ele.includes('avatar-'));
            this.companyAvatar = res.filter(ele=>ele.includes('avatar-'))
          }
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      async getCompanyInfo(corpId) {
        let res = await this.getData('getCompanyInfo', {}, corpId);
        this.companyIntroduce = JSON.parse(res.data[0].company_infos);
        this.companyDevelop = JSON.parse(res.data[0].company_develop).data;
      },
      /**
       * @description: 获取职位信息
       * @param {type} 
       * @return: 
       */
      async getJobData() {
        let res = await this.getData('getJobInfoByPage', { nowPage: this.nowPage, pageCount: this.pageCount });
        if (res.data) {
          res = res.data.map((ele, index) => {
            let job_detail = JSON.parse(ele.job_detail);
            return { ...ele, ...job_detail }
          });
        }
        this.tableData = res;
      },
      getData(url, data = {}, userid) {
        return this.$ajax({
          method: 'post',
          url,
          data: {
            data,
            userid
          }
        })
      },

    },
  }
</script>

<style style="text/less"  lang="less">
  .job-wrapper {
    height:100%;
    overflow: auto;
    .search-screen {
      margin-bottom: 20px;

      .demo-form-inline {

        display: flex;
        justify-content: start;

        .el-form-item {
          margin: 0 10px;
        }
      }
    }

    .job-info {
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

    .el-drawer__wrapper {
      .el-drawer.ttb {
        overflow: auto !important;
      }

      .content {
        padding: 20px;
        overflow: auto;

        .company-logo {
          background: rgb(242, 245, 244);
          height: 250px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .background {
            width: 60%;
            margin: 0 auto;
            border: 1px solid #efe2e2;
            background: #fff;
            display: flex;
            justify-content: start;
            align-items: center;
            height: 150px;

            img {
              width: 150px;
              height: 150px;
            }

            .right {
              margin-left:20px;
              .name {
                font-size: 30px;
                margin-bottom: 10px;
              }
            }
          }

        }

        .company-introduce {
          display: flex;
          margin-bottom: 20px;

          .left {
            width: 50%;
            margin-right: 20px;

            .content {
              color: #555;
              line-height: 25px;

              p {
                padding: 5px 0;

                i {
                  display: inline-block;
                  width: 16px;
                  height: 16px;
                  margin-right: 20px;
                  vertical-align: middle;
                  background-repeat: no-repeat;

                  &.type {
                    background-image: url(//www.lgstatic.com/lg-www-fed/company-c/modules/basic-info/img/type_icon_7d5884a.png?__sprite);
                  }

                  &.money {
                    background-image: url(//www.lgstatic.com/lg-www-fed/company-c/modules/basic-info/img/process_icon_33c5a37.png?__sprite);
                  }

                  &.people-count {
                    background-image: url(//www.lgstatic.com/lg-www-fed/company-c/modules/basic-info/img/number_icon_13c57a0.png?__sprite);
                  }

                  &.address {
                    background-image: url(//www.lgstatic.com/lg-www-fed/company-c/modules/basic-info/img/address_icon_5818d69.png?__sprite);
                  }
                }
              }

            }
          }

          .right {
            flex: 1;

            .content {
              color: #555;
              line-height: 25px;

            }
          }

          .title {
            height: 30px;
            line-height: 30px;
            font-size: 20px;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 100px;
              width: 80%;
              height: 1px;
              background: rgb(232, 232, 232)
            }
          }
        }

        .company-img {
          .title {
            height: 30px;
            line-height: 30px;
            font-size: 20px;
            position: relative;
            margin-bottom: 20px;

            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 100px;
              width: 90%;
              height: 1px;
              background: rgb(232, 232, 232)
            }
          }

          width:100%;
          height:600px;

          .el-carousel.el-carousel--horizontal {

            margin: 0 auto;
            width:70%;
            height: 90%;
            overflow: hidden;

            .el-carousel__container {
              height: 95%;
            }
          }

        }
      }
    }

    .el-drawer__wrapper.job-drawer {
      .content {
        width: 80%;
        margin: 0 auto;

        .header {
          width: 100%;
          height: 100px;
          line-height: 100px;
          background: rgb(242, 245, 244);
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;

          span {
            font-size: 20px;
            color: rgb(253, 95, 57);

          }
        }

        .body {

          .job-detail,
          .job-require {
            line-height: 30px;
            margin: 10px 0px;

            p {
              font-size: 16px;
              font-weight: 400;
              position: relative;

              &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 70px;
                width: 90%;
                height: 1px;
                background: #ccc;
              }
            }
          }
        }
      }
    }


  }
</style>