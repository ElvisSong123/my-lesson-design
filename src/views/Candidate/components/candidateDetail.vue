<!--
 * @Author: your name
 * @Date: 2020-03-27 14:49:19
 * @LastEditTime: 2020-03-28 23:39:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\Candidate\components\candidateDetail.vue
 -->
<template>
   <div class="wrapper">
    <div class="my-resume">
      <div class="person-info" v-if="clonePerson">
        <div class="avatar">
          <img :src=imgAvatar alt="">
          <div class="getInfo">
            <div class="name">
              <span>{{clonePerson.name}}</span>
              <i style="color: rgb(0, 179, 138)" v-if="clonePerson.sex == 1" class="iconfont-ats icon-jianlixiangqing-nanhui"></i>
              <i style="color: rgb(216,67,78)" v-else class="iconfont-ats icon-jianlixiangqing-nv"></i>

            </div>
            <div class="school">
              {{cloneEducation.school||'湖南文理学院'}} / {{cloneEducation.education || '本科'}} . 统招 / 应届毕业生 / {{clonePerson.city}} / {{clonePerson.age}}岁
            </div>
            <div class="other">
              <span style="margin-right:10px">
                <i class="iconfont-ats icon-jianlixiangqing-dianhua"></i>
                {{clonePerson.phone}}</span>
              <span>
                <i style="font-size:12px" class="iconfont-ats icon-jianlixiangqing-youxiang"></i>
                {{clonePerson.email}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="education-info" v-if="cloneEducation">
        <div class="avatar">
          <div class="pic"></div>
          <div class="title">教育经历</div>

        </div>
        <div class="education1">
          <div class="left">
            <i class="iconfont-ats icon-qiyeshezhi"></i>
          </div>
          <div class="right">
            <div class="header">
              <div class="school">{{cloneEducation.school}}</div>
              <div class="time">{{cloneEducation.startTime[0]}} - {{cloneEducation.startTime[1]}}</div>
            </div>
            <div class="foot">
              {{cloneEducation.education}} / {{cloneEducation.major}}
            </div>
          </div>
        </div>


      </div>
      <div class="internship-info" v-if="cloneInternship.length && cloneInternship[0]">
        <div class="avatar">
          <div class="pic"></div>
          <div class="title">实习经历</div>

        </div>
        <div :key="index1" class="internship1" v-for="(ele,index1) in cloneInternship">
          <div class="header">
            <span>{{ele.company}} / </span>
            <span>{{ele.department}}</span>

            <span class="time">{{ele.timeArea[0]}} - {{ele.timeArea[1]}}</span>
          </div>
          <div class="footer">
            <p style="color:#333;margin-bottom:5px">{{ele.jobName}}</p>
            {{ele.workContent}}
          </div>
        </div>
      </div>
      <div class="project-info" v-if="cloneProject.length && cloneProject[0]">
        <div class="avatar">
          <div class="pic"></div>
          <div class="title">项目经历</div>

        </div>
        <div :key="index1" class="project1" v-for="(ele,index1) in cloneProject">
          <div class="header">
            <span>{{ele.projectName}}</span>
            <span class="time">{{ele.projectTime&&ele.projectTime[0]}} - {{ele.projectTime&&ele.projectTime[1]}}</span>
          </div>
          <div class="footer">
            <p>{{ele.projectDetail}}</p>
            <p style="color:#333;margin-bottom:5px">{{ele.projectLink?'项目地址：'+ ele.projectLink:''}}</p>
          </div>
        </div>
      </div>
      <div class="major-skill-info" v-if="cloneMajor.length && cloneMajor[0]">
        <div class="avatar">
          <div class="pic"></div>
          <div class="title">专业技能</div>

        </div>
        <div class="major1">
          <p v-for="(item,index) in cloneMajor" :key="index">
            {{item}}
          </p>
        </div>
      </div>
      <div class="introduce-info" v-if="cloneEvaluate.length&&cloneEvaluate[0]">
        <div class="avatar">
          <div class="pic"></div>
          <div class="title">个人评价</div>

        </div>
        <div class="evaluate1">
          <p v-for="(item,index) in cloneEvaluate" :key="index">
            {{item}}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props: ['resumeData', 'userid'],
    data() {
      return {
        imgURL: '',
        haveResume: false,
        clonePerson: null,
        cloneEducation: null,
        cloneInternship: [],
        cloneProject: [],
        cloneMajor: null,
        cloneEvaluate: null,
        imgAvatar: ''
      }
    },
    computed: {},
    watch: {},
    created() {
      this.initResumedata(this.resumeData);
      console.log('entry')
      this.getAvatar(this.userid)
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      initResumedata(data) { //从数据库中找到对应的简历数据

        this.clonePerson = JSON.parse(data.personinfo);
        this.cloneEducation = JSON.parse(data.educationinfo);
        this.cloneInternship = JSON.parse(data.internshipinfo) && JSON.parse(data.internshipinfo).data || [];
        this.cloneProject = JSON.parse(data.projectinfo) && JSON.parse(data.projectinfo).data || [];
        this.cloneMajor = JSON.parse(data.majorskill) && JSON.parse(data.majorskill).data.majorSkill.split('//') || [];
        this.cloneEvaluate = JSON.parse(data.introduce) && JSON.parse(data.introduce).data.introduce.split('//') || [];
        if (this.clonePerson || this.cloneEducation || this.cloneInternship.length ||
          this.cloneProject.length || this.cloneMajor || this.cloneEvaluate) {
          this.haveResume = true
        }
      },
      getAvatar(userid) {
        this.$ajax({
          method: 'post',
          url: 'getUserAvatar',
          data: {
            userid
          }
        }).then((res) => {
          if (res) {
            this.imgAvatar = res
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
    position: relative;

    .remindInfo {
      position: relative;

      .remind {
        font-size: 20px;
        color: #508cff;
        position: absolute;
        bottom: 0%;
        left: 50%;
        transform: translate(-50%, 0);

        span {
          cursor: pointer;
          color: aqua;
        }
      }


    }

    .my-resume {
      padding: 20px;
      box-sizing: border-box;
      width: 60%;
      height: 90%;
      box-shadow: 0 0 10px 3px #ccc;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      overflow: auto;

      .person-info {
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;

        .avatar {
          height: 100%;
          display: flex;
          align-items: center;

          img {
            width: 100px;
            height: 100px;
            margin-right: 20px;
            border-radius: 50%;
            display: inline-block
          }

          .getInfo {
            .name {
              margin-bottom: 5px;

              span {
                font-size: 30px;
                font-weight: bold;
                margin-right: 10px;
              }

              i {
                font-size: 20px;

              }
            }

            .school {
              margin-bottom: 5px;
            }
          }
        }
      }

      .education-info {
        padding: 20px 0px;
        border-bottom: 1px solid #ccc;

        .avatar {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          .pic {
            width: 5px;
            height: 30px;
            background: rgb(0, 179, 138);
            margin-right: 10px;
          }

          .title {
            font-size: 20px;
            font-weight: bold;
          }
        }

        .education1 {
          display: flex;
          align-items: center;

          .left {
            i {
              font-size: 40px;
              color: aqua;
            }

            margin-right:10px;
          }

          .right {
            flex: 1;

            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;

              .school {
                font-size: 15px;
                font-weight: bold;
                color: rgb(51, 51, 51)
              }
            }
          }

        }
      }

      .internship-info,
      .project-info {
        padding: 20px 0px;
        border-bottom: 1px solid #ccc;

        .avatar {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .pic {
            width: 5px;
            height: 30px;
            background: rgb(0, 179, 138);
            margin-right: 10px;
          }

          .title {
            font-size: 20px;
            font-weight: bold;
          }
        }

        .internship1,
        .project1 {
          padding: 0 0 20px;

          &:last-of-type {
            border: none;
            padding: 0px;
          }

          .header {
            margin-bottom: 10px;

            span {
              font-size: 14px;
              color: #333;
              font-weight: 600;
            }

            span.time {
              float: right;
            }

            span.edit {
              display: none;
              float: right;
              color: #008c8c;
              cursor: pointer;
            }
          }

          .footer {
            font-size: 14px;
            color: #666;
            line-height: 20px;
          }
        }
      }

      .major-skill-info,
      .introduce-info {
        padding: 20px 0px;
        border-bottom: 1px solid #ccc;

        .avatar {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .pic {
            width: 5px;
            height: 30px;
            background: rgb(0, 179, 138);
            margin-right: 10px;
          }

          .title {
            font-size: 20px;
            font-weight: bold;
          }
        }

        .major1,
        .evaluate1 {
          p {
            font-weight: 400;
            line-height: 28px;
          }
        }
      }


    }
  }
</style>