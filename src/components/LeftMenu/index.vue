<template>
  <div class="left-menu">
    <ul>
      <li class="item-menu" v-for="(item,index) in allMenu" :key="index" @click="onMenuClick($event,item)">
        <template v-if="item.whoCanSee == currentStatus">
          <i :class="['iconfont-ats',item.src,{'active':item.isItemClick}]"></i>
          <span :class="[{'active':item.isItemClick}]">{{item.title}}</span>
          <i style="margin-left:20px" class="iconfont-ats icon-xiala2" v-if="item.children.length&&!item.showChild"></i>
          <i style="margin-left:20px" class="iconfont-ats icon-shangla" v-if="item.children.length&&item.showChild"></i>

          <ul class="ul-children" v-if="item.children.length&&item.showChild">
            <li class="item-menu children" v-for="(ele,index) in item.children" :key="index" @click="onMenuClick($event,ele)">
              <span :class="[{'active':ele.isItemClick}]">{{ele.title}}</span>
            </li>
          </ul>
        </template>

      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props: {},
    data() {
      return {
        currentStatus: '',
        allMenu: [
        {
          path: '/myResume',
          name: 'myResume',
          title: '我的简历',
          src: 'icon-toudijianli',
          isItemClick: false,
          showChild: true,
          parentTitle: null,
          whoCanSee: '学生',
          children: [
          {
            path: '/myResume/addResume',
            name: 'addResume',
            title: '添加/编辑简历',
            parentTitle: '我的简历',
            src: '',
            isItemClick: false,
            children: []
          },
          {
            path: '/myResume/viewResume',
            name: 'viewResume',
            title: '预览简历',
            parentTitle: '我的简历',

            src: '',
            isItemClick: false,
            children: []

          }]
        },
        {
          path: '/jobInfo',
          name: 'jobInfo',
          title: '职位信息',
          src: 'icon-zhiweiguanli',
          isItemClick: false,
          showChild: false,
          children: [],
          whoCanSee: '学生',
        },{
          path: '/deliveryFeedback',
          name: 'deliveryFeedback',
          title: '投递反馈',
          src: 'icon-tuijianfankui',
          isItemClick: false,
          children: [],
          whoCanSee: '学生'
        },{
          path: '/personalCenter',
          name: 'personalCenter',
          title: '个人中心',
          src: 'icon-houxuanren',
          isItemClick: false,
          children: [],
          whoCanSee: '学生'
        },
        {
          path: '/addCompanyInfo',
          name: 'addCompanyInfo',
          title: '公司简介',
          src: 'icon-qiyeshezhi',
          isItemClick: false,
          children: [],
          whoCanSee: '企业用户'
        }, {
          path: '/addJobInfo',
          name: 'addJobInfo',
          title: '新增职位',
          src: 'icon-mianshizhiwei',
          isItemClick: false,
          children: [],
          whoCanSee: '企业用户'
        },{
          path: '/candidate',
          name: 'candidate',
          title: '候选人',
          src: 'icon-houxuanren',
          isItemClick: false,
          children: [],
          whoCanSee: '企业用户'
        },{
          path: '/alreadyEntryJob',
          name: 'alreadyEntryJob',
          title: '确认入职',
          src: 'icon-yiruzhi',
          isItemClick: false,
          children: [],
          whoCanSee: '企业用户'
        },{
          path: '/userInfo',
          name: 'userInfo',
          title: '用户信息',
          src: 'icon-lijimianshi',
          isItemClick: false,
          children: [],
          whoCanSee: '管理员'
        },{
          path: '/userApply',
          name: 'userApply',
          title: '账号申请',
          src: 'icon-yaoqingshijian',
          isItemClick: false,
          children: [],
          whoCanSee: '管理员'
        },
        {
          path: '/recruitStatistic',
          name: 'recruitStatistic',
          title: '就业统计',
          src: 'icon-tongji',
          isItemClick: false,
          children: [],
          whoCanSee: '老师',
        },{
          path: '/announcement',
          name: 'announcement',
          title: '发布公告',
          src: 'icon-tuijianfankui',
          isItemClick: false,
          children: [],
          whoCanSee: '老师',
        }
        ]
      }
    },
    computed: {},
    watch: {},
    created() {
      const routeName = this.$router.currentRoute.name;
      this.initMenuStyle(this.allMenu, routeName);
      this.currentStatus = this.$cookie.getCookie('status');
      console.log(this.currentStatus)
    },
    watch: {
      $route(to, from) { //监听路由变化,主要是在点击浏览器返回或前进按钮时更新左侧菜单样式
        let routeName = to.path.split('/');
        routeName = routeName[routeName.length - 1];
        this.initMenuStyle(this.allMenu, routeName);
      }
    },
    mounted() {},
    methods: {
      initMenuStyle(menu, routeName) {
        menu.forEach((item) => {
          item.isItemClick = false;
          if (item.name == routeName) {
            item.isItemClick = true
          }
          if (item.children.length) {
            this.initMenuStyle(item.children, routeName)
          }
        })
      },

      onMenuClick(e, item) {
        e.stopPropagation();
        if (item.children.length && !item.parentTitle) { //如果当前点击的路由下有子路由，则该路由只有伸缩子路由列表的功能
          item.showChild = !item.showChild;
          return
        }
        this.allMenu.forEach((item) => { //先把所有路由都默认置为不被点击状态
          item.isItemClick = false;
          if (item.children.length) {
            item.children.forEach((ele) => {
              ele.isItemClick = false;
            })
          }
        })
        item.isItemClick = true; //当前点击路由给他一个点击状态
        const routeName = this.$router.currentRoute.name;
        if (routeName == item.name) { //再次点击同一个路由，直接返回，不重新渲染
          return
        }
        this.$router.push({ path: item.path })
      }
    },
  }
</script>

<style type="text/less"  lang="less"  scoped>
  .left-menu{
      width:200px;
      height:100%;
      box-shadow: 0px 5px 9px 1px #ccc;
      z-index:1;
      ul{
        margin-top:25px;
         .item-menu{
          width:100%; 
          line-height: 50px;
          padding-left:20px;
          box-sizing: border-box;
          color:rgb(0, 22, 83);
          font-size: 14px;
          cursor: pointer;
          .ul-children{
            margin-top: 0px;
            font-size: 10px;
            .item-menu.children{
              line-height: 40px;
          } 
          }
          
          i{
            color:rgb(155,165,158)
          }
          span{
            display:inline-block;
            margin-left:10px
          }
          i.active,span.active{
            color:rgb(80, 40, 255);
          }
          &:hover{
            color:rgb(80, 40, 255);
            i{
              color:rgb(80, 40, 255);
            }
          }
        }
      }
     
  }
</style>