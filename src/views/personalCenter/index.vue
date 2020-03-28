<!--
 * @Author: your name
 * @Date: 2020-03-28 13:56:12
 * @LastEditTime: 2020-03-28 21:07:07
 * @LastEditors: Please set LastEditors
 * @Description: 学生个人中心
 * @FilePath: \毕业设计\client\src\views\personalCenter\index.vue
 -->

<template>
  <div class="wrapper">
    <div class="header">
      <div class="add">
        <div class="title">
          <i class="iconfont-ats icon-weifenpeizhiwei"></i>
          入职信息</div>
        <div class="click" @click="openDialog" v-if="!tableData.length">
          <i class="iconfont-ats icon-jiahao1"></i>添加
        </div>
        <div v-else-if="tableData.length && !tableData[0].company_id">
          <div class="click" @click="openDialogEdit">
            <i class="iconfont-ats icon-jianlixiangqing-bianji"></i>编辑
          </div>
          <div class="click" @click="openDialogDel">
            <i class="iconfont-ats icon-shanchu"></i>删除
          </div>
        </div>
      </div>
      <div class="show">
        <el-table class="job-table" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="student_name" label="姓名" align="center">
          </el-table-column>
          <el-table-column label="公司名称" prop="company_name" width="180" align="center">
          </el-table-column>
          <el-table-column prop="deliver_jobname" label="职位名称" align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="public-announce">
      <div class="title">学院通知</div>
      <div class="choose-date" ref="chooseDate" @click="onChooseDate">
        <span class="active">近7天</span>
        <span>近15天</span>
        <span>近30天</span>
      </div>
      <div class="content">
        <ul>
          <li v-for="(item,index) in announceData" :key="index" @click="openDetailVisible(item)">
            <span class="order">{{index+1}}</span>
            <span class="span-title">{{item.announce_title}}<span>{{item.time}}</span> </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 弹窗模块 -->
    <el-dialog title="个人信息" :visible.sync="personDialogVisible" width="40%" center>
      <el-form ref="personInfoForm" :rules="personInfoRules" :model="personInfoForm" label-width="80px">
        <el-form-item label="专业" prop="major">
          <el-input v-model="personInfoForm.major"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="personInfoForm.sex" label="男">男</el-radio>
          <el-radio v-model="personInfoForm.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="入职企业" prop="company_name">
          <el-input v-model="personInfoForm.company_name"></el-input>
        </el-form-item>
        <el-form-item label="入职岗位" prop="deliver_jobname">
          <el-input v-model="personInfoForm.deliver_jobname"></el-input>
        </el-form-item>

        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onPersonSave">保存</el-button>
          <el-button @click="personDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="删除入职信息" :visible.sync="delDialogVisible" width="30%" center>
      <span>确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDeleteJobInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="infoDetailVisible" width="50%" height="40%" center>
      <div>
        <div style="font-size:20px;font-weight:bold;margin-bottom:20px" class="title">标题：{{infoDetail.announce_title}}</div>
        <div style="line-height:25px;height:200px;overflow:auto" class="title">正文：{{infoDetail.announce_content}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import deepClone from '@/toolsFunc/deepClone.js'
  export default {
    name: "",
    components: {},
    props: {},
    data() {
      return {
        infoDetailVisible: false,
        infoDetail: '',
        tableData: [],
        announceData: [],
        editData: false,
        personDialogVisible: false,
        delDialogVisible: false,
        personInfoRules: {
          company_name: [
            { required: true, message: '请输入企业名字', trigger: 'blur' },
          ],
          deliver_jobname: [
            { required: true, message: '请输入城市', trigger: 'blur' },
          ],
          major: [
            { required: true, message: '请输入专业', trigger: 'blur' },
          ]
        },
        personInfoForm: {
          company_name: '',
          deliver_jobname: '',
          major:'',
          sex:'男'
        },
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getPersonData();
      this.getAnnounce(); //获取学校公告
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      openDetailVisible(data) {
        this.infoDetail = data;
        this.infoDetailVisible = true;
      },
      onChooseDate(e) {
        let choose = this.$refs.chooseDate.children;
        choose.forEach((ele) => {
          ele.classList.remove('active')
        })
        e.target.classList.add('active')
      },
      getAnnounce() {
        this.$ajax({
          method: 'post',
          url: 'getAnnounceInfo',
          data: {}
        }).then((res) => {
          console.log(res.data);
          this.announceData = res.data
        })
      },
      onPersonSave() {
        this.$refs['personInfoForm'].validate((valid) => {
          this.personDialogVisible = false;
          this.$ajax({
            method: 'post',
            url: this.editData ? 'updateEntryJob' : 'confirmEnetryJob',
            data: {
              ...this.personInfoForm,
              userid: this.$cookie.getCookie('userid')
            }
          }).then((res) => {
            console.log(res);
            if (res.statusCode == 200) {
              this.getPersonData()
            }
          })

        })

      },
      getPersonData() {
        this.personDialogVisible = false;
        this.$ajax({
          method: 'post',
          url: 'getEnetryJob',
          data: {
            userid: this.$cookie.getCookie('userid')
          }
        }).then((res) => {
          console.log(res.data);
          if (res.data) {
            let res1 = res.data.map((ele) => {
              return { ...ele, deliver_jobname: ele.job_name }
            })
            this.tableData = res1;
          } else {
            this.tableData = [];
          }
        })
      },
      openDialog() {
        this.personDialogVisible = true;
      },
      openDialogEdit() {
        this.personInfoForm = deepClone(this.tableData[0]);
        this.personDialogVisible = true;
        this.editData = true;
      },
      openDialogDel() {
        this.delDialogVisible = true;
      },
      onDeleteJobInfo() {
        this.delDialogVisible = false;
        this.$ajax({
          method: 'post',
          url: 'delEnetryJob',
          data: {
            userid: this.$cookie.getCookie('userid')
          }
        }).then((res) => {
          console.log(res);
          res.statusCode == 200 ? this.$showMessage('删除成功', 'success') : '';
          this.getPersonData();
        })
      }
    },
  }
</script>

<style style="text/less"  lang="less"  scoped>
  .wrapper {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .add {
      width: 100%;
      height: 80px;
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 20px;
        font-weight: bold;

        i {
          font-size: 20px;
          color: #63d3c9
        }
      }

      .click {
        font-size: 14px;
        color: rgb(0, 179, 138);
        cursor: pointer;
        display: inline-block;
        margin: 0 10px;

        i {
          margin-right: 5px;
        }
      }
    }

    .public-announce {
      padding: 20px;
      flex: 1;
      background: #fff;
      margin-top: 20px;
      overflow: auto;

      .title {
        font-size: 20px;
        font-weight: bold;
      }

      .choose-date {
        margin-top: 10px;
        border-bottom: 1px solid #ccc;

        span {
          display: inline-block;
          width: 80px;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          text-align: center;
          cursor: pointer;
          &.active {
            background: #42e1d3;
            color: #fff;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
          }
        }
      }

      .content {
        ul {
          li {
            border-bottom: 1px solid #ccc;
            margin-left: 20px;

            .order {
              margin-left: 5px;
              padding: 20px 0px;
            }

            .span-title {
              display: inline-block;
              margin-left: 20px;
              padding: 20px 0px;
              box-sizing: border-box;
              font-size: 14px;

              span {
                font-size: 13px;
                color: #ccc;
                margin-left: 20px
              }

              cursor: pointer;

              &:hover {
                color: rgb(233, 58, 39)
              }
            }
          }
        }
      }
    }
  }
</style>