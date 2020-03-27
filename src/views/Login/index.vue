<template>
  <div class="wrapper-login">
    <div class="content-login">
      <div class="avatar">
        <i v-if="!imgURL" class="iconfont-ats icon-lijimianshi"></i>
        <img v-else :src=imgURL alt="" ref="avatarImg" width="100px" height="100px">
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" class="form-ruleForm" :hide-required-asterisk=true>
        <el-form-item style="color:red;font-size:20px" class="form-label" label="账号" prop="username">
          <el-input type="text" placeholder="请输入账号" v-model="ruleForm.username" @input="onInput"></el-input>
        </el-form-item>
        <el-form-item class="form-label" label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item class="form-label" label="身份" prop="status">
          <el-select class="choose-status" v-model="ruleForm.status" placeholder="请选择登录身份">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="onLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="go-register" style="margin-left:50px">
        没有账号？
        <span @click="goToRegister">点击申请</span>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import throttling from '@/toolsFunc/shakeAndThrottling.js'
  export default {
    name: "",
    components: {},
    props: {},
    data() {
      return {
        ruleForm: {
          username: '',
          password: '',
          status: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择身份', trigger: 'blur' }
          ]
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
        }, {
          value: '管理员',
          label: '管理员'
        }],
        isRequestLogin: false, //判断登录状态，加锁处理
        imgURL: '',
        thro: null
      }
    },
    computed: {},
    watch: {},
    created() {
      if (this.$route.query.username) {
        this.ruleForm.username = this.$route.query.username
      }
      this.getAvatar()
      this.thro = throttling.throttling(this.getAvatar, 1500);
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      getAvatar() {
        axios.get(`http://localhost:12306/getAvatar?username=${this.ruleForm.username}`, { responseType: 'arraybuffer' })
          .then((res) => {
            this.imgURL = `data: image/jpeg;base64,${btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
          }, (err) => {
            this.imgURL = ''
          });
      },
      onInput() {
        this.thro()
      },
      goToRegister() {
        this.$router.push({ path: '/applyCount' })
      },
      onLogin() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid && !this.isRequestLogin) {
            this.isRequestLogin = true;
            this.$ajax({
              method: 'post',
              url: 'login',
              data: {
                username: this.ruleForm.username,
                password: this.ruleForm.password,
                status: this.ruleForm.status
              }
            }).then((res) => {
              this.$cookie.setCookie(`sessionId`, res.cookie, 1);
              this.$cookie.setCookie(`username`, res.username, 1);
              this.$cookie.setCookie(`status`, res.status, 1);
              this.$cookie.setCookie(`userid`, res.userid, 1);
              window.sessionStorage.setItem('avatar', this.imgURL)
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
      handleInfo(res) {
        if (res.checkPass) {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 1500
          });
          let path = this.redirect(this.ruleForm.status);
          console.log(path)
          this.$router.push({ path })
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
      },
      redirect(status) {//根据不同的登录身份进行不同的路由跳转
        let direct = '/'
        if (status == '管理员') {
          direct = '/userInfo'
        } else if (status == '学生') {
          direct = '/myResume/viewResume'
        } else if (status == '企业用户') {
          direct = '/addCompanyInfo'
        } else {
          direct = '/addCompanyInfo'
        }
        return direct;
      }
    },
  }
</script>

<style style="text/less"  lang="less">
  .wrapper-login {
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
        height: 90px;
        text-align: center;
        line-height: 90px;

        i,
        img {
          display: inline-block;
          font-size: 50px;
          width: 60px;
          height: 60px;
          line-height: 60px;
          border: 3px solid #fff;
          box-shadow: 0 0 3px 1px #3498ff;
          border-radius: 50%;
          color: #3498ff;
          margin-left: 25px;
        }
      }

      .form-ruleForm {
        width: 400px;

        .form-label {
          .el-form-item__label {
            color: #fff;
            font-size: 16px !important;
            font-weight: bold;

          }

          .choose-status {
            width: 100% !important;
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