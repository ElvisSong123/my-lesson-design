<template>
  <div class="wrapper">
    <template>
      <div class="add-company" v-if="!cloneCompanyIntroduce">
        <div class="add">
          <div class="avatar">
            <div class="title">公司简介</div>
          </div>
          <div class="click" @click="addCompanyInfo">
            <i class="iconfont-ats icon-jiahao1"></i>添加
          </div>
        </div>
      </div>
      <div class="show" v-else>
        <div class="company-logo">
          <div class="name">
            <div class="logo">
              <div class="left">
                <div class="avatar">
                  <span v-if="!companyAvatar.length" @click="uploadImg('file1')">+</span>
                  <img v-else :src=companyAvatar alt="" @click="uploadImg('file1')">
                  <input type="file" id="file" ref="file1" style="display:none" @change="fileBtn('file1')">
                </div>
              </div>
              <div class="right">
                <p>{{cloneCompanyIntroduce.name}}</p>
                <p>{{cloneCompanyIntroduce.slogan}}</p>
              </div>
            </div>
            <div class="edit" @click="onEditCompanyInfo()">
              <i class="iconfont-ats icon-jianlixiangqing-bianji"></i>
              编辑
            </div>
          </div>

        </div>
        <div class="company-introduce">
          <div class="introduce">
            <div class="title">公司介绍</div>
            <div class="content">{{cloneCompanyIntroduce.introduce}}</div>
          </div>

          <div class="info">
            <div class="title">基本信息</div>
            <div class="content">
              <p>
                <i class="type"></i>
                {{cloneCompanyIntroduce.field}}
              </p>
              <p>
                <i class="money"></i>
                {{cloneCompanyIntroduce.finance}}
              </p>
              <p>
                <i class="people-count"></i>
                {{cloneCompanyIntroduce.scale}}
              </p>
              <p>
                <i class="address"></i>
                {{cloneCompanyIntroduce.address}}
              </p>
            </div>
          </div>

        </div>


      </div>
    </template>

    <template>
      <div class="company-develop" style="margin-top:20px;border:none">
        <div class="add">
          <div class="avatar">
            <div class="title">公司发展</div>
          </div>
          <div class="click" @click="companyDevelopVisible = true">
            <i class="iconfont-ats icon-jiahao1"></i>添加
          </div>
        </div>
      </div>
      <div class="block">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in cloneCompanyDevelop" :key="index" :timestamp="activity.time">
            <span>{{activity.event}}</span>
            <span class="edit" style="margin-left:10px" @click="openDelDevelopDialog(index)">
              <i class="iconfont-ats  icon-shanchu"></i>
              删除
            </span>
          </el-timeline-item>

        </el-timeline>
      </div>
    </template>

    <template>
      <div class="add-img" style="margin-top:20px;border:none">
        <div class="add">
          <div class="avatar">
            <div class="title">公司文化</div>
          </div>
          <div class="click">
            <input type="file" id="file" ref="file2" style="display:none" @change="fileBtn('file2')">
            <span @click="uploadImg('file2')">
              <i class="iconfont-ats icon-jiahao1"></i>上传图片 {{imgURL.length}} / 8
            </span>

          </div>
        </div>
      </div>
      <div class="img-box">
        <div class="box" v-for="(item,index) in imgURL" :key="index">
          <img :src=item alt="">
          <span :key="index" @click="onDelImg(index)">
            <i class="iconfont-ats  icon-shanchu"></i>
          </span>
        </div>
        <el-button class="submit" type="success" @click="submitImg">{{imgUrlArr.length ? '重新上传':'点击上传'}}</el-button>
      </div>
      <div class="img-box" v-if="imgUrlArr.length">
        <div class="box" v-for="(item,index) in imgUrlArr" :key="index">
          <img :src=item alt="">
        </div>
        <el-button class="submit" type="success" disabled>已上传</el-button>
      </div>

    </template>

    <!-- 弹窗模块 -->

    <el-dialog title="公司简介" :visible.sync="companyIntroduceVisible" width="37%" center>

      <el-form id="companyIntroduce" ref="companyIntroduce" :rules="companyIntroduceRules" :model="companyIntroduce" label-width="80px">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="companyIntroduce.name"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="companyIntroduce.address"></el-input>
        </el-form-item>
        <el-form-item label="融资情况" prop="finance">
          <el-select v-model="companyIntroduce.finance" placeholder="选择融资阶段" clearable>
            <el-option label="未融资" value="未融资"></el-option>
            <el-option label="天使轮" value="天使轮"></el-option>
            <el-option label="A轮" value="A轮"></el-option>
            <el-option label="B轮" value="B轮"></el-option>
            <el-option label="C轮" value="C轮"></el-option>
            <el-option label="D轮" value="D轮"></el-option>
            <el-option label="上市公司" value="上市公司"></el-option>
            <el-option label="不需要融资" value="不需要融资"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司规模" prop="scale">
          <el-select v-model="companyIntroduce.scale" placeholder="选择公司规模" clearable>
            <el-option label="少于15ren" value="0-15"></el-option>
            <el-option label="15-50人" value="15-50"></el-option>
            <el-option label="50-150人" value="50-150"></el-option>
            <el-option label="150-500人" value="150-500"></el-option>
            <el-option label="500-2000人" value="500-2000"></el-option>
            <el-option label="2000人以上" value=">2000"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业领域" prop="field">
          <el-input type="text" placeholder="请输入内容" v-model="companyIntroduce.field">
          </el-input>
        </el-form-item>
        <el-form-item label="公司标语" prop="slogan">
          <el-input type="text" placeholder="请输入内容" v-model="companyIntroduce.slogan">
          </el-input>
        </el-form-item>
        <el-form-item label="公司简介" prop="introduce">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="companyIntroduce.introduce">
          </el-input>
        </el-form-item>
        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onCompanySave">保存</el-button>
          <el-button @click="onCompanyCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="公司历年发展" :visible.sync="companyDevelopVisible" width="37%" center>

      <el-form id="companyDevelop" ref="companyDevelop" :rules="companyDevelopRules" :model="companyDevelop" label-width="80px">
        <el-form-item label="时间" prop="time">
          <el-date-picker type="date" placeholder="选择日期" v-model="companyDevelop.time" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="事件" prop="event">
          <el-input v-model="companyDevelop.event"></el-input>
        </el-form-item>
        <el-form-item class="el-item-button">
          <el-button type="primary" @click="onCompanyDevelopSave">保存</el-button>
          <el-button @click="onCompanyDevelopCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="删除公司发展概况" :visible.sync="developDeleteDialogVisible" width="30%" center>
      <span>确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="developDeleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDeleteDevelop">确 定</el-button>
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
        companyAvatar: '',
        imgURL: [],
        imgFile: [],
        imgUrlArr: [],
        isUploadAvatar: false,
        developDeleteDialogVisible: false,
        companyDevelopVisible: false,
        isRequestLoading: false,
        companyIntroduceVisible: false,
        isEditCompanyInfo: false,
        delIndex: '',
        companyIntroduce: {
          name: '',
          address: '',
          finance: '',
          scale: '',
          introduce: '',
          field: '',
          slogan: '',
        },
        companyDevelop: {
          time: '',
          event: ''
        },
        cloneCompanyDevelop: [],
        companyDevelopRules: {
          time: [
            { required: true, message: '请输入时间', trigger: 'blur' },
          ],
          event: [
            { required: true, message: '请输入事件', trigger: 'blur' },
          ]
        },
        cloneCompanyIntroduce: '',
        companyIntroduceRules: {
          name: [
            { required: true, message: '请输入公司', trigger: 'blur' },
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' },
          ],
          introduce: [
            { required: true, message: '请输入简介', trigger: 'blur' },
          ]
        },
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getCompanyInfo();
      this.getCompanyImg();
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      getCompanyImg() {
        this.imgUrlArr = [];
        this.$ajax({
          method: 'post',
          url: `getCompanyImg?userid=${this.$cookie.getCookie('userid')}`,
        }).then((res) => {
          if (res) {
            console.log(res,'songbiao')
            this.imgUrlArr = res.filter(ele=>!ele.includes('avatar-'));
            this.companyAvatar = res.filter(ele=>ele.includes('avatar-'));
            console.log(this.companyAvatar)
          }
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      /**
       * @description: 上传图片
       * @param {type} 
       * @return: 
       */
      submitImg() {//上传企业文化图片请求函数
        const formData = new FormData(); //使用formdata上传文件
        if (this.imgFile.length) {
          this.imgFile.forEach((ele, index) => {
            formData.append("imgfile", ele, ele.name);
          });
        } else {
          formData.append("imgfile", '');
        }
        this.$ajax({
          method: 'post',
          url: `sendCompanyImg?username=${this.$cookie.getCookie('userid')}`,
          data: formData
        }).then((res) => {
          if (res) {
            this.$showMessage(res.message, 'success');
            setTimeout(() => {
              this.getCompanyImg();
            }, 1000);
          }
        }, (err) => {
          this.$message.error('服务器开小差');

        })
      },

      /**
       * @description: 上传企业头像请求函数
       * @param {type} 
       * @return: 
       */
      sendAvatarImg(avatar) {
        if (avatar) {
          const formData = new FormData(); //使用formdata上传文件
          formData.append("imgfile", avatar, avatar.name);
          this.$ajax({
            method: 'post',
            url: `sendCompanyImg?username=${this.$cookie.getCookie('userid')}&avatar=avatar`,
            data: formData
          }).then((res) => {
            if (res) {
               console.log('上传成功')
            }
          }, (err) => {
            console.log('上传失败')
          })
        }
      },

      onDelImg(index) {
        this.imgURL.splice(index, 1);
        this.imgFile.splice(index, 1);
      },
      /**
       * @description: 生成二进制图片格式
       * @param {type} 
       * @return: 
       */
      fileBtn(fileRef) {
        let inputFile = this.$refs[fileRef];
        let fileObj = inputFile.files[0];
        const windowURL = window.URL || window.webkitURL; //使用该方法生成二进制格式的图片
        if (fileObj) {
          const imgURL = windowURL.createObjectURL(fileObj);
          if (this.imgURL.length < 8) {
            if (!this.isUploadAvatar) { //不是上传头像的情况下
              this.imgURL.push(imgURL);
              this.imgFile.push(fileObj)
            } else {
              this.companyAvatar = imgURL;
              this.isUploadAvatar = false;
              this.sendAvatarImg(fileObj);
            }
          } else {
            this.$showMessage('最多上传8张图片', 'warning')
          }

        } else {
          this.imgURL = this.imgURL;
        }
      },
      /**
       * @description: 打开选择图片文件弹窗
       * @param {type} 
       * @return: 
       */
      uploadImg(fileRef) {
        if (fileRef == 'file1') {
          this.isUploadAvatar = true; //上传企业头像
        }
        this.$refs[fileRef].click();
      },
      /**
       * @description:打开删除弹窗
       * @param {type} 
       * @return: 
       */
      openDelDevelopDialog(index) {
        this.developDeleteDialogVisible = true;
        this.delIndex = index;
      },
      /**
       * @description: 删除公司发展概况
       * @param {type} 
       * @return: 
       */
      async onDeleteDevelop() {
        this.cloneCompanyDevelop.splice(this.delIndex, 1);
        await this.getData('addCompanyDevelop', { data: this.cloneCompanyDevelop });
        this.developDeleteDialogVisible = false;
        this.delIndex = '';
      },
      /**
       * @description: 保存公司发展概况
       * @param {type} 
       * @return: 
       */
      onCompanyDevelopSave() {
        this.$refs['companyDevelop'].validate(async (valid) => {
          if (valid) {
            this.cloneCompanyDevelop.push(this.companyDevelop);
            this.companyDevelop = {
              time: '',
              event: ''
            }
            await this.getData('addCompanyDevelop', { data: this.cloneCompanyDevelop });
            this.companyDevelopVisible = false;
            this.resetFormRule('companyDevelop');
          } else {
            return false;
          }

        });
      },
      onCompanyDevelopCancel() {
        this.companyDevelopVisible = false;
        this.resetFormRule('companyDevelop')
      },

      /**
       * @description: 编辑公司信息
       * @param {type} 
       * @return: 
       */
      onEditCompanyInfo() {
        this.companyIntroduceVisible = true;
        this.isEditCompanyInfo = true;
        this.companyIntroduce = deepClone(this.cloneCompanyIntroduce)
      },
      /**
       * @description: 从数据库获取公司信息
       * @param {type} 
       * @return: 
       */
      async getCompanyInfo() {
        let res = await this.getData('getCompanyInfo');
        this.cloneCompanyIntroduce = JSON.parse(res.data[0].company_infos);
        this.$store.commit('addCompanyInfo', this.cloneCompanyIntroduce); //公司信息存入vuex,用于共享。
        this.cloneCompanyDevelop = JSON.parse(res.data[0].company_develop).data;
      },
      addCompanyInfo() {
        this.companyIntroduceVisible = true;
      },
      resetFormRule(formName) { //重置表单信息
        this.$refs[formName] && this.$refs[formName].resetFields();
      },
      onCompanyCancel() {
        this.companyIntroduceVisible = false
        this.resetFormRule('companyIntroduce')
      },
      onCompanySave() {
        this.$refs['companyIntroduce'].validate(async (valid) => {
          if (valid && !this.isRequestLoading) {
            this.isRequestLoading = true;
            let res = await this.getData(this.isEditCompanyInfo ? 'editCompanyInfo' : 'addCompanyInfo', this.companyIntroduce);
            this.dealData(res);
            this.isRequestLoading = false;
            this.companyIntroduceVisible = false;
            this.resetFormRule('companyIntroduce');
          } else {
            this.isRequestLoading = false;
            return false;
          }

        });
      },
      getData(url, data = {}) {
        return this.$ajax({
          method: 'post',
          url,
          data: {
            ...data,
            userid: this.$cookie.getCookie('userid')
          }
        })
      },
      /**
       * @description: 处理ajax返回的数据
       * @param {type} 
       * @return: 
       */
      dealData(res) {
        if (res.statusCode == 200) {
          this.$showMessage(res.message, 'success');
          this.cloneCompanyIntroduce = deepClone(this.companyIntroduce);
        } else {
          this.$showMessage(res.message, 'error')
        }
      }
    },
  }
</script>

<style style="text/less"  lang="less"  scoped>
  .wrapper {
    overflow: auto;
    height: 100%;

    .add-company,
    .company-develop,
    .add-img {
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

    .show {
      padding: 20px;
      overflow: auto;

      background: #fff;

      .company-logo {
        margin-bottom: 20px;

        .name {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;

          .logo {
            display: flex;
            align-items: center;

            .left {
              margin-right: 20px;

              .avatar {
                width: 108px;
                height: 108px;
                text-align: center;

                span,
                img {
                  margin-right: 20px;
                  display: inline-block;
                  margin-bottom: 8px;
                  font-size: 50px;
                  width: 100px;
                  height: 100px;
                  cursor: pointer;
                  line-height: 100px;
                  border: 3px solid #fff;
                  box-shadow: 0 0 3px 1px #3498ff;
                  border-radius: 50%;
                  color: #3498ff;
                }

                p {
                  width: 100%;
                  font-size: 12px;
                  text-align: center;
                  color: #fff;
                  margin-left: 40px;

                }
              }
            }

            .right {
              p:first-of-type {
                font-size: 30px;
                margin-bottom: 5px;
              }
            }

          }

          .edit {
            color: rgb(0, 179, 138);
            cursor: pointer
          }


        }

      }

      .company-introduce {
        display: flex;
        justify-content: space-between;

        .introduce {
          width: 45%;
        }

        .info {
          width: 45%;
        }

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
          margin-bottom: 10px;

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
    }

    .company-develop,
    .add-img {
      margin-bottom: 0px;
    }

    .block {
      background: #fff;
      padding: 20px;

      .edit {
        float: right;
        color: rgb(0, 179, 138);
        font-size: 12px;
        cursor: pointer
      }


    }

    .img-box {
      box-sizing: border-box;
      width: 100%;
      min-height: 120px;
      background: #94d1ee;
      padding: 10px;
      display: flex;
      align-items: center;

      .box {
        display: inline-block;
        position: relative;
        margin: 0 10px;

        img {
          width: 100px;
          height: 100px;

        }

        span {
          position: absolute;
          cursor: pointer;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          opacity: 0.8;

          i {
            font-size: 20px;
          }
        }
      }

      .submit {}

    }
  }
</style>