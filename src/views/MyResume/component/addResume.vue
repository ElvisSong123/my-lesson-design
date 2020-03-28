<template>
  <div class="wrapper-addResume">
    <div :class="['person-info',{'readyInfo':clonePerson}]">
      <div class="add" v-if="!clonePerson">
        <div class="avatar">
          <img :src=imgURL alt="">
          <div class="title">个人信息</div>
        </div>
        <div class="click" @click="onPersonInfoShow('personDialogVisible','personInfoForm')">
          <i class="iconfont-ats icon-jiahao1"></i>添加
        </div>
      </div>
      <div class="show" v-else>
        <div class="avatar">
          <img :src=imgURL alt="">
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
        <div class="edit" @click="onEditPersonInfo('personDialogVisible','personInfoForm')">
          <i class="iconfont-ats icon-jianlixiangqing-bianji"></i>
          编辑
        </div>
      </div>
    </div>

    <template v-for="(item,index) in allTitle">
      <div :class="[item.className,{'active':item.cloneData}]" :key="index">
        <div class="add" v-if="!item.cloneData || (Array.isArray(item.cloneData) && item.cloneData.length == 0)">
          <div class="avatar">
            <div class="pic"></div>
            <div class="title">{{item.title}}</div>

          </div>
          <div class="click" @click="onAddInfoShow($event,item)">
            <i class="iconfont-ats icon-jiahao1"></i>添加
          </div>
        </div>
        <div class="show" v-else>
          <div class="avatar">
            <div class="pic"></div>
            <div class="title">{{item.title}}</div>
            <div class="edit" @click="item.editData(item.dialog,item.form)" v-if="item.className != 'internship-experience' && item.className != 'project-experience'">
              <i class="iconfont-ats icon-jianlixiangqing-bianji"></i>
              编辑
            </div>
            <div class="edit" v-else @click="addInternshipData(item.dialog)">
              <i class="iconfont-ats icon-jiahao1"></i>
              添加
            </div>
          </div>
          <div class="education1" v-if="item.className == 'education'">
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
          <template v-if="item.className == 'internship-experience'">
            <div :key="index1" class="internship1" v-for="(ele,index1) in cloneInternship" @mouseenter="onInternshipMouseEnter" @mouseleave="onInternshipMouseLeave">
              <div class="header">
                <span>{{ele.company}} / </span>
                <span>{{ele.department}}</span>
                <span class="edit" style="margin-left:10px" @click="openDelInternshipDialog('internshipDeleteDialogVisible',index1)">
                  <i class="iconfont-ats  icon-shanchu"></i>
                  删除
                </span>
                <span class="edit" @click="item.editData(item.dialog,ele,index1)">
                  <i class="iconfont-ats icon-jianlixiangqing-bianji"></i>
                  编辑
                </span>
                <span class="time">{{ele.timeArea[0]}} - {{ele.timeArea[1]}}</span>
              </div>
              <div class="footer">
                <p style="color:#333;margin-bottom:5px">{{ele.jobName}}</p>
                {{ele.workContent}}
              </div>
            </div>
          </template>


           <template v-if="item.className == 'project-experience'">
            <div :key="index1" class="project1" v-for="(ele,index1) in cloneProject" @mouseenter="onInternshipMouseEnter" @mouseleave="onInternshipMouseLeave">
              <div class="header">
                <span>{{ele.projectName}}</span> 
                <span class="edit" style="margin-left:10px" @click="openDelProjectDialog('projectDeleteDialogVisible',index1)">
                  <i class="iconfont-ats  icon-shanchu"></i>
                  删除
                </span>
                <span class="edit" @click="item.editData(item.dialog,ele,index1)">
                  <i class="iconfont-ats icon-jianlixiangqing-bianji"></i>
                  编辑
                </span>
                <span class="time">{{ele.projectTime&&ele.projectTime[0]}} - {{ele.projectTime&&ele.projectTime[1]}}</span>
              </div>
              <div class="footer">
                <p>{{ele.projectDetail}}</p>
                <p style="color:#333;margin-bottom:5px">{{ele.projectLink?'项目地址：'+ ele.projectLink:''}}</p>
              </div>
            </div>
          </template>
          <div class="major1" v-if="item.className == 'major-skill'">
            <p v-for="(item,index) in cloneMajor" :key="index">
              {{item}}
            </p>
          </div>
          <div class="evaluate1" v-if="item.className == 'person-evaluate'">
            <p v-for="(item,index) in cloneEvaluate" :key="index">
              {{item}}
            </p>
          </div>

        </div>
      </div>
    </template>

    <!-- 弹框模块 -->
    <el-dialog title="个人信息" :visible.sync="personDialogVisible" width="40%" center>
      <el-form ref="personInfoForm" :rules="personInfoRules" :model="personInfoForm" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="personInfoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="personInfoForm.sex" label="1">男</el-radio>
          <el-radio v-model="personInfoForm.sex" label="0">女</el-radio>
        </el-form-item>
         <el-form-item label="年龄" prop="age">
          <el-input v-model="personInfoForm.age"></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input v-model="personInfoForm.city"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model.number="personInfoForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="personInfoForm.email"></el-input>
        </el-form-item>
        <el-form-item label="当前身份" prop="status">
          <el-radio v-model="personInfoForm.status" label="1">学生</el-radio>
          <el-radio v-model="personInfoForm.status" label="0">非学生</el-radio>
        </el-form-item>
        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onPersonSave('personInfoForm','personDialogVisible','clonePerson',sendPersonInfo)">保存</el-button>
          <el-button @click="personDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>




    <el-dialog title="教育经历" :visible.sync="educationDialogVisible" width="40%" center>
      <el-form ref="educationInfoForm" :rules="educationInfoRules" :model="educationInfoForm" label-width="80px">
        <el-form-item label="学校" prop="school">
          <el-input v-model="educationInfoForm.school"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="educationInfoForm.major"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="startTime">
          <el-date-picker size="large" v-model="educationInfoForm.startTime" type="daterange" range-separator="至" start-placeholder="入学日期" end-placeholder="毕业日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-select v-model="educationInfoForm.education" placeholder="请选择">
            <el-option v-for="(item,index) in educationOption" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onPersonSave('educationInfoForm','educationDialogVisible','cloneEducation',sendEducationInfo)">保存</el-button>
          <el-button @click="educationDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="实习经历" :visible.sync="internshipDialogVisible" width="37%" center>

      <el-form id="interInfo" ref="internshipInfo" :rules="internshipInfoRules" :model="internshipInfo" label-width="80px">
        <el-form-item label="公司" prop="company">
          <el-input v-model="internshipInfo.company"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="internshipInfo.department"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="jobName">
          <el-input v-model="internshipInfo.jobName"></el-input>
        </el-form-item>
        <el-form-item label="实习时间" prop="timeArea">
          <el-date-picker size="large" v-model="internshipInfo.timeArea" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作内容" prop="workContent">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="internshipInfo.workContent">
          </el-input>
        </el-form-item>
        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onPersonSave('internshipInfo','internshipDialogVisible','cloneInternship',sendInternshipInfo)">保存</el-button>
          <el-button @click="internshipDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    


    <el-dialog title="项目经历" :visible.sync="projectDialogVisible" width="30%" center>
        <el-form  ref="projectInfoForm" :rules="projectInfoRules" :model="projectInfoForm" label-width="80px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="projectInfoForm.projectName"></el-input>
        </el-form-item>
        <el-form-item label="项目周期" prop="projectTime">
         <el-date-picker size="large" v-model="projectInfoForm.projectTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目链接" prop="projectLink">
          <el-input v-model="projectInfoForm.projectLink"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="projectDetail">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="projectInfoForm.projectDetail">
          </el-input>
        </el-form-item>
        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onPersonSave('projectInfoForm','projectDialogVisible','cloneProject',sendProjectInfo)">保存</el-button>
          <el-button @click="projectDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-dialog title="专业技能" :visible.sync="majorDialogVisible" width="40%" center>
       <el-form  ref="majorSkillForm" :model="majorSkillForm" :rules="majorSkillRules"  label-width="80px">
        <el-form-item label="专业技能" prop="major">
          <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="majorSkillForm.majorSkill">
          </el-input>
        </el-form-item>
        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onPersonSave('majorSkillForm','majorDialogVisible','cloneMajor',sendMajorSkill)">保存</el-button>
          <el-button @click="majorDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-dialog title="个人评价" :visible.sync="evaluateDialogVisible" width="30%" center>
      <el-form  ref="introduceForm" :model="introduceForm" :rules="introduceRules"  label-width="80px">
        <el-form-item label="个人简介" prop="introduce">
          <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="introduceForm.introduce">
          </el-input>
        </el-form-item>
        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onPersonSave('introduceForm','evaluateDialogVisible','cloneEvaluate',sendPersonIntroduce)">保存</el-button>
          <el-button @click="evaluateDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="删除实习经历" :visible.sync="internshipDeleteDialogVisible" width="30%" center>
      <span>确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="internshipDeleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDeleteInternship">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除项目经历" :visible.sync="projectDeleteDialogVisible" width="30%" center>
      <span>确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="projectDeleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDeleteProject">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
  import resumeData from '../resumeData.js'
  import deepClone from '@/toolsFunc/deepClone.js'
  export default {
    name: "",
    components: {},
    props: {},
    data() {
      return {
        imgURL: '',
        personDialogVisible: false,
        educationDialogVisible: false,
        internshipDialogVisible: false,
        projectDialogVisible: false,
        majorDialogVisible: false,
        evaluateDialogVisible: false,
        internshipDeleteDialogVisible:false,
        projectDeleteDialogVisible:false,

        ...resumeData,

        clonePerson:'',
        cloneEducation: [],
        cloneInternship: [],
        cloneInternshipNew:[],
        cloneProject: [],
        cloneMajor: null,
        cloneEvaluate: null,
        isPersonResumeEdit: false,
        isEducationEdit: false,
        isInternshipEdit: false,
        isInternshipEditIndex: null,
        isProjectEdit:false,
        isProjectEditIndex:null,
        internshipHover: false,
        isEditMajor:false


      }
    },
    computed: {
      allTitle() {
        return [{
          className: 'education',
          title: '教育经历',
          dialog: 'educationDialogVisible',
          form: 'educationInfoForm',
          cloneData: this.cloneEducation,
          editData: this.onEditEducation
        }, {
          className: 'internship-experience',
          title: '实习经历',
          dialog: 'internshipDialogVisible',
          cloneData: this.cloneInternship,
          editData: this.onEditInternship
        }, {
          className: 'project-experience',
          title: '项目经历',
          dialog: 'projectDialogVisible',
          cloneData: this.cloneProject,
          editData:this.onEditProject
        }, {
          className: 'major-skill',
          title: '专业技能',
          dialog: 'majorDialogVisible',
          cloneData: this.cloneMajor,
          editData:this.onEditMajor
        }, {
          className: 'person-evaluate',
          title: '个人评价',
          dialog: 'evaluateDialogVisible',
          cloneData: this.cloneEvaluate,
          editData:this.onEditIntroduce
        }]
      }
    },
    watch: {},
    created() {
      this.imgURL = window.sessionStorage.getItem('avatar');
      let isAdd = this.$cookie.getCookie('isAdd');

      //如果之前提交过数据，则再次刷新页面时从数据库中拿数据。
      this.getPersonResume()

    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      cancelInternship(){ 
        this.internshipDialogVisible = false
      },
      onDeleteInternship(){
        this.internshipDeleteDialogVisible = false;
        this.cloneInternship.splice(this.deleteInternshipIndex,1)
        this.sendInternshipInfo(this.cloneInternship,'internshipDeleteDialogVisible')
      },
      onDeleteProject(){
        this.projectDeleteDialogVisible = false;
        this.cloneProject.splice(this.deleteProjectIndex,1)
        this.sendProjectInfo(this.cloneProject,'projectDeleteDialogVisible')
      },
      openDelProjectDialog(dialog,index){
        this[dialog] = true;
        this.deleteProjectIndex = index;
      },
      openDelInternshipDialog(dialog,index){
        this[dialog] = true;
        this.deleteInternshipIndex = index;
      },
      onInternshipMouseEnter(e) {
        e.target.classList.add('active')
      },
      onInternshipMouseLeave(e) {
        e.target.classList.remove('active')
      },
      getPersonResume() { //从数据库中找到对应的简历数据
        this.$ajax({
          method: 'post',
          url: 'getResumeData',
          data: {
            userid: this.$cookie.getCookie('userid')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            console.log(res)
            this.clonePerson = JSON.parse(res.data.personinfo) || [];
            this.cloneEducation = JSON.parse(res.data.educationinfo) || [];
            this.cloneInternship = JSON.parse(res.data.internshipinfo) && JSON.parse(res.data.internshipinfo).data || [];
            this.cloneProject = JSON.parse(res.data.projectinfo) && JSON.parse(res.data.projectinfo).data || [];
            this.cloneMajor = JSON.parse(res.data.majorskill) && JSON.parse(res.data.majorskill).data.majorSkill.split('//') || [];
            this.cloneEvaluate = JSON.parse(res.data.introduce) && JSON.parse(res.data.introduce).data.introduce.split('//') || [];
          }

        })
      },
      onEditPersonInfo(dialog) { //点击编辑按钮打开编辑弹窗
        this.isPersonResumeEdit = true;
        this[dialog] = true;
        this.personInfoForm = deepClone(this.clonePerson);
      },
      onEditEducation(dialog) {
        this.isEducationEdit = true;
        this[dialog] = true;
        this.educationInfoForm = deepClone(this.cloneEducation);
      },
      onEditInternship(dialog, ele, index) {
        this.isInternshipEditIndex = index;
        this.isInternshipEdit = true;
        this[dialog] = true;
        this.internshipInfo = deepClone(ele);
      },
      onEditProject(dialog, ele, index){//编辑项目经历
        this.isProjectEditIndex = index;
        this.isProjectEdit = true;
        this[dialog] = true;
        this.projectInfoForm = deepClone(ele);
      },
      onEditMajor(dialog, ele, index){ 
        this.isEditMajor = true;
        this[dialog] = true;
        this.majorSkillForm.majorSkill= deepClone(this.cloneMajor).toString();
      },
      onEditIntroduce(dialog, ele, index){
        this.isEditIntroduce = true;
        this[dialog] = true;
        this.introduceForm.introduce= deepClone(this.cloneEvaluate).toString();
      },
      addInternshipData(dialog) {//新增实习经历按钮点击事件
        this[dialog] = true;
        this.isInternshipEdit = false;
        this.resetFormInfo(this.internshipInfo);
      },
      onAddInfoShow(e, item) { //点击添加按钮打开添加弹窗
        this[item.dialog] = true
      },
      onPersonInfoShow(dialog) { //点击个人信息添加按钮打开添加弹窗

        this[dialog] = true
      },
      onPersonSave(formName, dialog, cloneObj, callback) { //保存个人添加信息的数据

        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName == 'internshipInfo' || formName == 'projectInfoForm') { //如果编辑窗口是实习经历，用数组存储数据
              if (this.isInternshipEdit && this.isInternshipEditIndex != null ||
              this.isProjectEdit && this.isProjectEditIndex != null) {
                this[cloneObj].splice(this.isInternshipEditIndex || this.isProjectEditIndex, 1, deepClone(this[formName]))
              } else {
                this[cloneObj].push(deepClone(this[formName])); //深度克隆，数据备份
              }
              callback(this[cloneObj], formName)
            } else {
              this[cloneObj] = deepClone(this[formName]); //深度克隆，数据备份
              console.log(this[cloneObj])
              callback(this[formName], formName)
            }

            this[dialog] = false
          } else {
            return false;
          }

        });
      },

      resetFormRule(formName) { //重置信息表单
        this.$refs[formName]&&this.$refs[formName].resetFields();
      },
      resetFormInfo(obj){
        for(let i in obj){
            obj[i] = ''
        }
      },
      sendPersonInfo(data, formName) { //把个人信息数据提交给服务器
        this.$ajax({
          method: 'post',
          url: this.isPersonResumeEdit ? 'editPersonData' : 'addPersonData', //判断是编辑数据还是新增数据
          data: {
            ...data,
            operator: this.$cookie.getCookie('username'),
            user_id:this.$cookie.getCookie('userid')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500
            });
            this.$cookie.setCookie('isAdd', true) //设置cookie表明当前用户提交过了数据
          } else {
            this.$message({
              message: res.message,
              type: 'error',
              duration: 1500
            });
          }
          this.resetFormRule(formName)

        })
      },
      sendEducationInfo(data, formName) {
        this.$ajax({
          method: 'post',
          url: this.isEducationEdit ? 'eidtEducationInfo' : 'addEducationInfo', //判断是编辑数据还是新增数据
          data: {
            ...data,
            operator: this.$cookie.getCookie('username')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            console.log(res)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500
            });
          } else {
            this.$message({
              message: res.message,
              type: 'error',
              duration: 1500
            });
          }
          this.resetFormRule(formName)

        })
      },
      sendInternshipInfo(data, formName) {
        let reg = /\s/g;
        for (let i = 0; i < data.length; i++) {
          data[i].workContent = data[i].workContent.replace(reg, '');
        }
        this.$ajax({
          method: 'post',
          url: this.isInternshipEdit ? 'editInternshipInfo' : 'addInternshipInfo', //判断是编辑数据还是新增数据
          data: {
            data,
            operator: this.$cookie.getCookie('username')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500
            });
            this.cloneInternship = this.cloneInternship;
          } else {
            this.$message({
              message: res.message,
              type: 'error',
              duration: 1500
            });
          }
          formName&&this.resetFormRule(formName)
          this.isInternshipEdit = false
        })
      },
      sendProjectInfo(data, formName) {
        let reg = /\s/g;
        for (let i = 0; i < data.length; i++) {
          data[i].projectDetail = data[i].projectDetail.replace(reg, '');
        }
        this.$ajax({
          method: 'post',
          url: this.isProjectEdit?'editProjectInfo':'addProjectInfo', //判断是编辑数据还是新增数据
          data: {
            data,
            operator: this.$cookie.getCookie('username')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500
            });
          } else {
            this.$message({
              message: res.message,
              type: 'error',
              duration: 1500
            });
          }
          formName&&this.resetFormRule(formName)
        })
      },
      sendMajorSkill(data, formName) {
        console.log(data,'songbiao')
        let reg = /\n/g; 
        data.majorSkill = data.majorSkill.replace(reg, '//');
        this.cloneMajor = deepClone(data)
        this.cloneMajor = this.cloneMajor.majorSkill.split('//');
        this.$ajax({
          method: 'post',
          url: this.isEditMajor?'editMajorInfo':'addMajorInfo', //判断是编辑数据还是新增数据
          data: {
            data,
            operator: this.$cookie.getCookie('username')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500
            });
          } else {
            this.$message({
              message: res.message,
              type: 'error',
              duration: 1500
            });
          }
          formName&&this.resetFormRule(formName)
        })
      },
      sendPersonIntroduce(data, formName) {
        let reg = /\n/g;
        let ma = data.introduce.match(reg)
        data.introduce = data.introduce.replace(reg, '//');
        this.cloneEvaluate = deepClone(data)
        this.cloneEvaluate = this.cloneEvaluate.introduce.split('//');
        this.$ajax({
          method: 'post',
          url: this.isEditIntroduce?'editIntroduce':'addIntroduce', //判断是编辑数据还是新增数据
          data: {
            data,
            operator: this.$cookie.getCookie('username')
          }
        }).then((res) => {
          if (res.statusCode == 200) {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500
            });
          } else {
            this.$message({
              message: res.message,
              type: 'error',
              duration: 1500
            });
          }
          formName&&this.resetFormRule(formName)
        })
      }
    },
    
  }
</script>

<style style="text/less" lang="less">
  .wrapper-addResume {
    width: 100%;
    height: 100%;

    .person-info,
    .education,
    .internship-experience,
    .project-experience,
    .major-skill,
    .person-evaluate {
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

    .education.active,
    .internship-experience.active,
    .project-experience.active,
    .major-skill.active,
    .person-evaluate.active{
      background: rgb(250, 250, 250);
      height: fit-content;
      padding: 20px;

      .show {
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

          .edit {
            position: absolute;
            right: 0px;
            font-size: 14px;
            color: rgb(0, 179, 138);
            cursor: pointer
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

        .internship1,.project1{
          padding: 20px 0px;
          border-bottom: 1px solid #ccc;

          &:last-of-type {
            border: none;
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

        .internship1.active,
        .project1.active {
          .header {
            span.time {
              display: none;
              float: right;
            }

            span.edit {
              font-size: 14px;
              display: inline-block;
              float: right;
              color: rgb(0, 179, 138);
              cursor: pointer;

              &>i {
                font-size: 12px;
              }
            }
          }
        }
        .major1,.evaluate1{
          p{
            font-weight: 400;
            line-height: 28px;
            font-size: 14px;
          }
        }
      }
    }

    .person-info {
      .add {
        .avatar {
          img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
            border-radius: 50%;
            display: inline-block
          }
        }
      }
    }

    .person-info.readyInfo {
      height: 200px;
      background: rgb(250, 250, 250);

      .show {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

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

        .edit {
          font-size: 16px;
          color: rgb(0, 179, 138);
          cursor: pointer;
        }

      }
    }


    .el-item-button .el-form-item__content {
      margin-left: 0px !important;
      text-align: center
    }

  }
</style>