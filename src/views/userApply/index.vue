<!--
 * @Author: your name
 * @Date: 2020-03-26 12:49:59
 * @LastEditTime: 2020-04-09 17:08:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\views\userInfo\index.vue
 -->
<template>
  <div class="wrapper">
    <div class="job-info">
      <el-table class="job-table" :data="tableData" stripe style="width: 100%">

        <el-table-column prop="name" label="申请用户" width="180" align="center">
        </el-table-column>
        <el-table-column prop="number" label="学号/职工号/电话" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column prop="status" label="身份" align="center">
        </el-table-column>
        <el-table-column prop="apply_time" label="申请时间" align="center">
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="{row}">
                <el-button type="success" @click="openAddUserVisible(row)">确认添加</el-button>
                <el-button type="danger"  @click="openDelUserVisible(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页插件 -->
      <!-- <div class="block">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="allJobDataCount">
        </el-pagination>
      </div> -->
    </div>

    <!-- 弹窗模块 -->
    <el-dialog title="确认添加？" :visible.sync="addUserVisible" width="30%" center>
      <span>确认添加?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="确认删除？" :visible.sync="delUserVisible" width="30%" center>
      <span>确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDelUser">确 定</el-button>
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
        tableData: [],
        addUserVisible:false,
        addUserInfo:{},
        delUserVisible:false,
        delUserInfo:{}
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getApplyUser() //获取用户的申请信息
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
      openDelUserVisible(data){
        this.delUserVisible = true;
        this.delUserInfo = data;
      },
      openAddUserVisible(data){
        this.addUserVisible = true;
        this.addUserInfo = data;
      },
      getApplyUser() {
        this.$ajax({
          method: 'post',
          url: 'getapplyCount',
          data: {}
        }).then((res) => {
            console.log(res);
            this.tableData = res.data
        }, (err) => {
          this.$message.error('服务器开小差');
        })
      },
      onAddUser(){
        this.$ajax({
          method: 'post',
          url: 'addUserApply',
          data: {
            ...this.addUserInfo
          }
        }).then((res) => {
            if(res.status == 200){
              this.$showMessage('添加成功','success');
              this.getApplyUser()
            }
        }, (err) => {
          this.$message.error('服务器开小差');
        })
        this.addUserVisible = false;
      },
      onDelUser(){
        this.$ajax({
          method: 'post',
          url: 'delUserApply',
          data: {
            ...this.delUserInfo
          }
        }).then((res) => {
            if(res.status == 200){
              this.$showMessage('删除成功','success');
              this.getApplyUser()
            }
        }, (err) => {
          this.$message.error('服务器开小差');
        })
        this.delUserVisible = false;
      }
    },
  }
</script>

<style style="text/less"  lang="less"  scoped>
  .wrapper{
    width:100%;
    height:100%;
    overflow: auto;
  }
</style>