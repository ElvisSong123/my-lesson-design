<!--
 * @Author: your name
 * @Date: 2020-03-23 11:51:11
 * @LastEditTime: 2020-03-30 10:11:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\addJobInfo\index.vue
 -->
<template>
   <div class="wrapper">
    <div class="add-job">
      <div class="add">
        <div class="avatar">
          <div class="title">新增职位</div>
        </div>
        <div class="click" @click="openJobInfoVisible">
          <i class="iconfont-ats icon-jiahao1"></i>添加
        </div>
      </div>
    </div>
    <div class="job-detail" v-if="addJobInfoArr.length">
      <div class="detail" ref="jobDetail" v-for="(item,index) in addJobInfoArr" :key="index" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <div class="head">
          <div class="left">
            <span style="margin-right:5px">{{item.job_detail.jobName}}</span>
            <span style="margin-right:10px">({{item.job_detail.address}})</span>
            <span style="color:#ccc;font-size:12px">{{item.job_detail.addTime}}发布</span>
          </div>
          <div class="right">
            <span class="company-name">{{companyInfo.name}}</span>
            <span class="operate">
              <span class="del" style="margin-left:10px" @click="delJobInfo(item.job_id)">
                <i class="iconfont-ats  icon-shanchu"></i>
                删除
              </span>
              <span class="edit" @click="editJobInfo(index)">
                <i class="iconfont-ats icon-jianlixiangqing-bianji"></i>
                编辑
              </span>
            </span>
          </div>
        </div>
        <div class="foot">
          <div class="left">
            <span>{{item.job_detail.money}}</span>
            <span>应届毕业生 / </span>
            <span>{{item.job_detail.education}}</span>
          </div>
          <div class="right">
            <span>{{companyInfo.field}} / </span>
            <span>{{companyInfo.finance}} / </span>
            <span>{{companyInfo.scale}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗模块 -->
    <el-dialog title="添加职位" :visible.sync="addJobVisible" width="37%" center @close="onJobCancel">
      <el-form id="addJobInfo" ref="addJobInfo" :rules="addJobInfoRules" :model="addJobInfo" label-width="80px">
        <el-form-item label="职位名称" prop="jobName">
          <el-input v-model="addJobInfo.jobName"></el-input>
        </el-form-item>
        <el-form-item label="工作地点" prop="address">
          <el-input v-model="addJobInfo.address"></el-input>
        </el-form-item>
        <el-form-item label="学历要求" prop="education">
          <el-select v-model="addJobInfo.education" placeholder="选择学历" clearable>
            <el-option v-for="(item,index) in educationOption" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资待遇" prop="money">
          <el-input type="text" placeholder="请输入薪资" v-model="addJobInfo.money">
          </el-input>
        </el-form-item>
        <el-form-item label="职位描述" prop="jobDescribe">
          <el-input type="textarea" :rows="5" placeholder="请输入描述" v-model="addJobInfo.jobDescribe">
          </el-input>
        </el-form-item>
        <el-form-item label="岗位要求" prop="jobRequire">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="addJobInfo.jobRequire">
          </el-input>
        </el-form-item>
        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onJobSave">保存</el-button>
          <el-button @click="onJobCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="删除职位信息" :visible.sync="delJobInfoVisible" width="30%" center>
      <span>确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delJobInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDelJobInfo">确 定</el-button>
      </span>
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
        delJobInfoVisible: false,
        delId: '',
        editUuid: '',
        isHover: false,
        addJobVisible: false,
        isRequestLoading: false,
        isEditJobInfo: false,
        addJobInfoArr: [],
        addCompanyInfoToJob: '',
        companyInfo: '',
        addJobInfo: {
          jobName: '',
          address: '',
          education: '',
          money: '',
          jobDescribe: '',
          jobRequire: '',
          addTime: ''
        },
        addJobInfoRules: {
          jobName: [
            { required: true, message: '请输入职位', trigger: 'blur' },
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' },
          ],
          education: [
            { required: true, message: '请输入学历', trigger: 'blur' },
          ],
          jobDescribe: [
            { required: true, message: '请输入工作描述', trigger: 'blur' },
          ],
          jobRequire: [
            { required: true, message: '请输入岗位要求', trigger: 'blur' },
          ]
        },
        educationOption: [
          '大专',
          '本科',
          '硕士',
          '博士',
          '不限'
        ],
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getJobInfo();
      this.getCompanyInfo();
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      async onDelJobInfo() {
        let res = await this.getData('delJobInfo', this.delId);
        if (res.statusCode == 200) {
          this.$showMessage('删除成功', 'success');
          this.getJobInfo(); //重新获取职位数据
        }
        this.delJobInfoVisible = false;
      },
      /**
       * @description: 删除职位信息
       * @param {type} 
       * @return: 
       */
      delJobInfo(id) {
        this.delJobInfoVisible = true;
        this.delId = id;
      },
      /**
       * @description: 编辑职位信息
       * @param {type} 
       * @return: 
       */
      editJobInfo(index) {
        this.addJobVisible = true;
        this.isEditJobInfo = true;
        this.editUuid = this.addJobInfoArr[index].job_id;
        this.addJobInfo = deepClone(this.addJobInfoArr[index].job_detail);
      },
      onMouseEnter(e) {
        e.target.classList.add('is-hover')
      },
      onMouseLeave() {
        this.$refs.jobDetail.forEach((ele) => {
          ele.classList.remove('is-hover');
        })
      },
      /**
       * @description: 获取公司基本信息
       * @param {type} 
       * @return: 
       */
      async getCompanyInfo() {
        let res = await this.getData('getCompanyInfo');
        this.companyInfo = JSON.parse(res.data[0].company_infos);
        let { name, finance, field } = this.companyInfo;
        this.addCompanyInfoToJob = {
          name,
          finance,
          field
        } //加上公司基本信息到职位数据库
      },
      /**
       * @description: 获取职位信息
       * @param {type} 
       * @return: 
       */
      async getJobInfo() {
        this.addJobInfoArr = [];
        let res = await this.getData('getJobInfo');
        if (res.data) {
          res = res.data.map((ele, index) => {
            return { ...ele, job_detail: JSON.parse(ele.job_detail) }
          })
          this.addJobInfoArr.push(...res);
          console.log(this.addJobInfoArr)
        }
      },
      /**
       * @description: 打开新增职位弹窗
       * @param {type} 
       * @return: 
       */
      openJobInfoVisible() {
        this.addJobVisible = true;
      },
      getNowTime() {
        return `${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()}  ${new Date().getHours()}:${new Date().getMinutes()}`
      },
      /**
       * @description:添加职位保存
       * @param {type} 
       * @return: 
       */
      onJobSave() {
        this.$refs['addJobInfo'].validate(async (valid) => {
          if (valid && !this.isRequestLoading) {
            this.isRequestLoading = true;
            this.addJobInfo.addTime = this.getNowTime(); //获取当前添加时间
            let res = await this.getData(this.isEditJobInfo ? 'editJobInfo' : 'addJobInfo', { ...this.addJobInfo, ...this.addCompanyInfoToJob, jobId: this.editUuid });
            if (res.statusCode == 200 && !this.isEditJobInfo) {
              this.$showMessage('添加成功', 'success')
            } else {
              this.$showMessage('修改成功', 'success')
            }
            this.getJobInfo();
            this.addJobInfo = {
              jobName: '',
              address: '',
              education: '',
              money: '',
              jobDescribe: '',
              jobRequire: '',
              addTime: ''
            }
            this.isRequestLoading = false;
            this.addJobVisible = false;
            this.isEditJobInfo = false;
            this.resetFormRule('addJobInfo');
          } else {
            this.isRequestLoading = false;
            return false;
          }

        });
      },
      /**
       * @description: 发送请求获取数据
       * @param {type} 
       * @return: 
       */
      getData(url, data = {}) {
        return this.$ajax({
          method: 'post',
          url,
          data: {
            data,
            userid: this.$cookie.getCookie('userid')
          }
        })
      },
      dealData(data) {
        console.log(data, 1234)
      },
      onJobCancel() {
        this.resetFormRule('addJobInfo')
        this.addJobVisible = false;
        this.isEditJobInfo = false;
        this.addJobInfo = {
          jobName: '',
          address: '',
          education: '',
          money: '',
          jobDescribe: '',
          jobRequire: '',
          addTime: ''
        }

      },
      resetFormRule(formName) { //重置表单信息
        this.$refs[formName] && this.$refs[formName].resetFields();
      },
    },
  }
</script>

<style style="text/less"  lang="less"  scoped>
  .wrapper {
    width:100%;
    height:100%;
    overflow: auto;
    .add-job,
    .job-detail {
      height: 70px;
      border: 1px solid #b5b0b0;
      border-right: 0px;
      padding: 0 20px;
      margin-bottom: 20px;
      background: #fff;

      .add {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .avatar {
          display: flex;
          align-items: center;

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

        .click {
          font-size: 14px;
          color: rgb(0, 179, 138);
          cursor: pointer
        }
      }


    }

    .job-detail {
      height: fit-content;

      .detail {
        height: 70px;
        border-bottom: 1px solid #ccc;
        margin-top: 20px;

        &:last-of-type {
          border: none;
        }

        .head,
        .foot {
          display: flex;
          justify-content: space-between;
          color: rgb(0, 179, 138);

          .left {
            font-size: 16px;
          }

          .right {
            font-size: 16px;

            .operate {
              display: none;
            }
          }
        }

        .foot {
          margin-top: 10px;

          .left {
            span {
              color: #333;
              font-size: 14px;
            }

            span:first-of-type {
              color: #fd5f39;
              margin-right: 10px;
              font-size: 16px;
            }
          }

          .right {
            color: #333;
            font-size: 12px;
          }
        }
      }

      .detail.is-hover {
        .head {
          .right {
            .company-name {
              display: none;
            }

            .operate {
              display: inline-block;
              font-size: 12px;

              i {
                font-size: 12px;
              }

              span {
                margin: 0 5px;
                cursor: pointer
              }
            }
          }
        }

      }
    }
  }
</style>