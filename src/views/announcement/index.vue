<!--
 * @Author: your name
 * @Date: 2020-03-29 10:57:28
 * @LastEditTime: 2020-03-29 23:01:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\announcement\index.vue
 -->
<template>
  <div class="wrapper">
    <div class="show-message">
      <div class="title">我的发布:</div>
      <div class="my-deliver">
        <div class="no-data" v-if="!myDeliver.length">暂无数据</div>
        <ul v-else>
          <li v-for="(item,index) in myDeliver" :key="index">
            <div>
              <el-popover :ref="index" placement="top-start" title="内容" width="200" trigger="hover" :content="item.announce_content">
              </el-popover>
              <div v-popover="index">
                <span style="margin-right:20px">{{item.announce_title}}</span>
                <span>{{item.time}}</span>
              </div>
            </div>

            <el-button type="danger" size="mini" @click="openDelVisible(item)">删除</el-button>
          </li>
        </ul>
      </div>
    </div>
    <div class="deliver-message">
      <el-form label-width="80px" :model="deliverInfoForm" ref="deliverInfoForm" :rules="deliverInfoFormRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="deliverInfoForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" placeholder="请输入内容" rows="8" v-model="deliverInfoForm.content"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="success" style="width:100px;margin:0 auto" @click="onDeliverMessage">发布</el-button>
    </div>

    <el-dialog title="删除信息" :visible.sync="delDialogVisible" width="30%" center>
      <span>确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDelMessage">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "",
    components: {},
    props: {},
    data() {
      return {
        myDeliver: [],
        delDialogVisible:false,
        delId:'',
        deliverInfoForm: {
          title: '',
          content: '',
        },
        deliverInfoFormRules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
        },
        date: '',
      }
    },
    computed: {},
    watch: {},
    created() {
      this.date = new Date();
      this.getMyDelivetAnnounce()
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      openDelVisible(item){
            this.delDialogVisible = true;
            this.delId = item.id
        },
      onDelMessage() { 
          this.delDialogVisible = false;
          this.$ajax({
            method: 'post',
            url: 'delAnnounce',
            data: { 
              id:this.delId
            }
          }).then((res) => {
            console.log(res);
            if (res.statusCode == 200) {
              this.$showMessage('删除成功', 'success'); 
              this.getMyDelivetAnnounce();
            }
          })
       
      },
      onDeliverMessage() {
        this.$refs['deliverInfoForm'].validate((valid) => {
          this.$ajax({
            method: 'post',
            url: 'deliverAnnounce',
            data: {
              ...this.deliverInfoForm,
              time: `${this.date.getFullYear()}-${(this.date.getMonth()+1+'').padStart(2,'0')}-${(this.date.getDate()+'').padStart(2,'0')}`,
              userid: this.$cookie.getCookie('userid')
            }
          }).then((res) => { 
            if (res.statusCode == 200) {
              this.$showMessage('发布成功', 'success');
              this.resetForm('deliverInfoForm');
              this.getMyDelivetAnnounce();
            }
          })
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getMyDelivetAnnounce() {
        this.$ajax({
          method: 'post',
          url: 'getMyDelivetAnnounce',
          data: {
            userid: this.$cookie.getCookie('userid')
          }
        }).then((res) => { 
          if (res.statusCode == 200) { 
            this.myDeliver = res.data; 
          }
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

    .show-message {
      flex: 1;
      overflow: auto;
      .title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .my-deliver {
        width: 100%;
        box-sizing: border-box;
        padding-left: 30px;
        .no-data{
            width:100%;
            text-align: center;
            font-size:30px;
            font-weight: 400;
            margin-top:100px
        }
        ul {
          li {
            height:50px;
            border-bottom: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            cursor: pointer;
          }
        }
      }
    }

    .deliver-message {
      height: 300px;
      border: 1px solid #4772d1;
      overflow: hidden;
      border-radius: 10px;
      padding: 20px 30px 20px 0;
      display: flex;
      justify-content: center;
      flex-direction: column;

    }
  }
</style>