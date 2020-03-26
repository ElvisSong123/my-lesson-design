<template>
  <div class="wrapper-register">

    <div class="content-login">
      
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="form-ruleForm">
        <el-form-item class="form-label" label="身份" prop="status">
          <el-select class="choose-status" v-model="ruleForm.status" placeholder="请选择登录身份">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="color:red;font-size:20px" class="form-label" label="姓名" prop="name">
          <el-input type="text" placeholder="请输入姓名" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="ruleForm.status" style="color:red;font-size:20px" class="form-label" :label="myNumber" prop="number">
          <el-input type="text" :placeholder="myPlaceholder" v-model.number="ruleForm.number"></el-input>
        </el-form-item>
        <el-form-item style="color:red;font-size:20px" class="form-label" label="邮箱" prop="email">
          <el-input type="text" placeholder="请输入邮箱" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click='submitInfo'>确认提交</el-button>
        </el-form-item>
      </el-form>
      <div class="go-register" style="margin-left:80px" >
        已有账号？
        <span @click="goToRegister">点击登录</span>
      </div>
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
        ruleForm: {
          status:'',
          name: '',
          number: '',
          email: '',
        },
         options: [{
          value: '学生',
          label: '学生'
        }, {
          value: '老师',
          label: '老师'
        }, {
          value: '企业用户',
          label: '企业用户'
        }],
        rules: {
          status: [
            { required: true , message: '请选择身份', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名' , trigger: 'blur' }
          ],
          number: [
            { required: true, trigger: 'blur' },
            { type: 'number', message: '请输入正确的学号' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]
        },
        isRequestRegister: false
      };
    },
    computed: {
      myNumber(){
        if(this.ruleForm.status == '学生'){
          return '学号'
        }
        if(this.ruleForm.status == '老师'){
          return '职工号'
        }
        if(this.ruleForm.status == '企业用户'){
          return '电话'
        }
      },
      myPlaceholder(){
        if(this.ruleForm.status == '学生'){
          return '请输入学号'
        }
        if(this.ruleForm.status == '老师'){
          return '请输入职工号'
        }
        if(this.ruleForm.status == '企业用户'){
          return '请输入电话'
        }
      }
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {
      submitInfo() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid && !this.isRequestRegister) {
            this.isRequestLogin = true;
            this.$ajax({
              method: 'post',
              url: 'applyCount',
              data: {
                status:this.ruleForm.status,
                name: this.ruleForm.name,
                number: this.ruleForm.number,
                email: this.ruleForm.email
              }
            }).then((res) => {
              this.handleInfo(res);
              this.isRequestLogin = false;
            }, (err) => {
              this.$message.error('服务器开小差');
              this.isRequestLogin = false;

            })
          } else {
            return false;
          }
        });
      },

      goToRegister() {
        this.$router.push({ path: '/login' })
      },

      handleInfo(res) {
        if (res.updated) {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 3000
          });
          setTimeout(()=>{
            this.$router.push('/login')
          },1000)
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 1500,
            offset: 0,
            customClass: 'my-message'
          });
        }
      }
    }
  }
</script>

<style style="text/less"  lang="less">
  .wrapper-register {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url("../../assets/image/register.jpg");
    background-size: 100% 100%;

    .content-login {
      width: 400px;
      height: fit-content;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;

      .avatar {
        width: 100%;
        height: 108px;
        text-align: center;

        span {
          display: inline-block;
          margin-bottom: 8px;
          font-size: 50px;
          width: 60px;
          height: 60px;
          cursor: pointer;
          line-height: 60px;
          border: 3px solid #fff;
          box-shadow: 0 0 3px 1px #3498ff;
          border-radius: 50%;
          color: #3498ff;
          margin-left: 80px;
        }

        p {
          width: 100%;
          font-size: 12px;
          text-align: center;
          color: #fff;
          margin-left: 40px;
        }
      }

      .form-ruleForm {
        width: 400px;

        .form-label {
          .el-form-item__label {
            color: #d3c1c1;
            font-size: 16px !important;
            font-weight: bold;
          }
          .choose-status{
              width:100% !important;
            }

        }
      }

      .go-register {
        span {

          color: #f40;
          cursor: pointer;

          &:hover {
            color: red;
          }
        }

      }
    }

  }
</style>