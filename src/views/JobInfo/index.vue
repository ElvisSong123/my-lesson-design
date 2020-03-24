<template>
  <div class="job-wrapper">
    <!--条件筛选-->
    <div class="search-screen">
      <el-form :inline="true" :model="jobSearch" class="demo-form-inline">
        <el-form-item label="公司地点">
          <el-input v-model="jobSearch.place" placeholder="输入公司地点"></el-input>
        </el-form-item>
        <el-form-item label="融资阶段">
          <el-select v-model="jobSearch.financ" placeholder="选择融资阶段" clearable>
            <el-option label="未融资" value="noFinanc"></el-option>
            <el-option label="天使轮" value="firstFinanc"></el-option>
            <el-option label="A轮" value="A-Financ"></el-option>
            <el-option label="B轮" value="B-Financ"></el-option>
            <el-option label="C轮" value="C-Financ"></el-option>
            <el-option label="D轮" value="D-Financ"></el-option>
            <el-option label="上市公司" value="publicCompony"></el-option>
            <el-option label="不需要融资" value="noNeedFinanc"></el-option>
          </el-select>
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
          <div class="company-name" slot-scope="{ row }" style="cursor:pointer" @click="openJobDetail">
            {{row.companyName}}
          </div>
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center">
        </el-table-column>
        <el-table-column prop="financ" label="融资情况" align="center">
        </el-table-column>
        <el-table-column prop="workField" label="行业领域" align="center">
        </el-table-column>
        <el-table-column prop="recruitPositions" label="在招职位" align="center">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <el-button type="success">投递</el-button>
        </el-table-column>
      </el-table>
      <!-- 分页插件 -->
      <div class="block">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
      </div>
    </div>

    <!-- 抽屉弹框 -->
    <el-drawer :visible.sync="drawer" :direction="direction" size="100%">
      <div slot="title" style="font-size:20px">公司详情</div>
      <div class="content">
        <div class="company-logo">
          <div class="background">
            <img src="https://www.lgstatic.com/thumbnail_300x300/i/image/M00/72/A0/CgpFT1o8uG6AV6iJAABIpIC8ytU647.png" alt="">
            <div class="right">
              <div class="name">湖南理财网</div>
              <div class="signWord">小恩爱是一家设计与技术并重的互联网公司，在这儿每个人都创造了非凡的价值！</div>
            </div>
          </div>
        </div>
        <div class="company-introduce">
          <div class="left">
            <div class="introduce">
              <div class="title">公司介绍</div>
              <div class="content">小恩爱开创于2011年，是全球领先的情侣应用产品，是专为情侣打造的私密应用，覆盖情侣用户超过1.5亿，小恩爱为情侣提供私密互动空间、情侣社区、情侣消费指南等一站式服务。核心团队均来自百度，
                腾讯，阿里，新浪等顶尖互联网公司，让天下有情人终成眷属是我们的使命。</div>
            </div>

            <div class="info">
              <div class="title">基本信息</div>
              <div class="content">
                <p>
                  <i class="type"></i>
                  社交，游戏
                </p>
                <p>
                  <i class="money"></i>
                  上市公司
                </p>
                <p>
                  <i class="people-count"></i>
                  150-200
                </p>
                <p>
                  <i class="address"></i>
                  深圳
                </p>
              </div>
            </div>

          </div>
          <div class="right">
            <div class="develop">
              <div class="title" style="margin-bottom:20px">发展历程</div>
              <div class="block">
                <el-timeline>
                  <el-timeline-item v-for="(activity, index) in activities" :key="index" :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp">
                    {{activity.content}}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </div>
        </div>
        <div class="company-img">
          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="item in imgArr" :key="item">
              <img style="width:100%;height:100%" :src=item alt="">
            </el-carousel-item>
          </el-carousel>
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
        drawer: false,
        direction: 'ttb',
        currentPage: 10,
        jobSearch: {
          place: '',
          financ: '',
          job: ''
        },
        imgArr:['https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2806979248,3096179224&fm=26&gp=0.jpg',
        'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=110038289,1629420447&fm=111&gp=0.jpg',
        'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3538964778,1567388528&fm=11&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2908843824,328016317&fm=11&gp=0.jpg'],
        tableData: [{
          companyName: '湖南理财网',
          financ: 'A轮',
          address: '上海市普陀区金沙江路 1518 弄',
          workField: '互联网',
          recruitPositions: '前端开发工程师'
        }, {
          companyName: '湖南理财网',
          financ: 'A轮',
          address: '上海市普陀区金沙江路 1518 弄',
          workField: '互联网',
          recruitPositions: '前端开发工程师'
        }, {
          companyName: '湖南理财网',
          financ: 'A轮',
          address: '上海市普陀区金沙江路 1518 弄',
          workField: '互联网',
          recruitPositions: '前端开发工程师'
        }, {
          companyName: '湖南理财网',
          financ: 'A轮',
          address: '上海市普陀区金沙江路 1518 弄',
          workField: '互联网',
          recruitPositions: '前端开发工程师'
        }],

        activities: [{
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }]
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    beforeDestroy() {},
    methods: {
      handleSizeChange() {},
      handleCurrentChange() {},
      openJobDetail() {
        this.drawer = true;
      },

    },
  }
</script>

<style style="text/less"  lang="less">
  .job-wrapper {
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
      .el-drawer.ttb{
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
              .name {
                font-size: 30px;
                margin-bottom: 10px;
              }
            }
          }

        }

        .company-introduce {
          display: flex;

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

        .company-img{
          width:98%;
          height:600px;
          margin:0 auto;
          .el-carousel.el-carousel--horizontal{
            height:100%;
            overflow: hidden;
            .el-carousel__container{
            height:95%;
          }
          }
          
        }
      }
    }


  }
</style>