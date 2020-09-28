<template>
  <div id="header">
    <Menu theme="light" mode="horizontal" @on-select="handleRoute" :active-name="activeMenu" class="oj-menu">
      <a href="/"><div class="logo"><img id="logo" src="../../../assets/logo.jpg" alt="oj logo"/></div></a>
      <Menu-item name="/">
        <Icon type="home"></Icon>
        {{$t('m.Home')}}
      </Menu-item>
      <Menu-item name="/CourseList">
        <Icon type="ios-book"></Icon>
      {{$t('m.Signup_Lectures')}}
      </Menu-item>
      <Menu-item name="/lecture">
        <Icon type="ios-book"></Icon>
      {{$t('m.Lectures')}}
      </Menu-item>
      <Menu-item name="/contest">
        <Icon type="ios-book"></Icon>
        {{$t('m.Public_Contests')}}
      </Menu-item>
      <Menu-item name="/problem">
        <Icon type="ios-keypad"></Icon>
        {{$t('m.NavProblems')}}
      </Menu-item>
      <Menu-item name="/status">
        <Icon type="ios-pulse-strong"></Icon>
        {{$t('m.NavStatus')}}
      </Menu-item>
      <Menu-item name="/question">
        <Icon type="help"></Icon>
        {{$t('m.publicQA')}}
      </Menu-item>
      <Submenu name="rank">
        <template slot="title">
          <Icon type="podium"></Icon>
          {{$t('m.Rank')}}
        </template>
        <Menu-item name="/acm-rank">
          {{$t('m.ACM_Rank')}}
        </Menu-item>
        <Menu-item name="/oi-rank">
          {{$t('m.OI_Rank')}}
        </Menu-item>
      </Submenu>
      <Submenu name="about">
        <template slot="title">
          <Icon type="information-circled"></Icon>
          {{$t('m.About')}}
        </template>
        <Menu-item name="/about">
          {{$t('m.Judger')}}
        </Menu-item>
        <Menu-item name="/FAQ">
          {{$t('m.FAQ')}}
        </Menu-item>
      </Submenu>
      <template v-if="!isAuthenticated">
        <div class="btn-menu">
          <Button type="ghost"
                  ref="loginBtn"
                  shape="circle"
                  @click="handleBtnClick('login')">{{$t('m.Login')}}
          </Button>
          <Button v-if="website.allow_register"
                  type="ghost"
                  shape="circle"
                  @click="handleBtnClick('register')"
                  style="margin-left: 5px;">{{$t('m.Register')}}
          </Button>
        </div>
      </template>
      <template v-else>
        <div class="drop-menu">
          <Dropdown class="drop-menu" @on-click="handleRoute" placement="bottom" trigger="click">
            <Button type="text" class="drop-menu-title">{{ user.username }}
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <Dropdown-menu slot="list">
              <Dropdown-item name="/user-home">{{$t('m.MyHome')}}</Dropdown-item>
              <Dropdown-item name="/status?myself=1">{{$t('m.MySubmissions')}}</Dropdown-item>
              <Dropdown-item name="/setting/profile">{{$t('m.Settings')}}</Dropdown-item>
              <Dropdown-item v-if="isAdminRole" name="/admin">{{$t('m.Management')}}</Dropdown-item>
              <Dropdown-item divided name="/logout">{{$t('m.Logout')}}</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
          <el-row>
            <el-col :span="4">
              <span class="notify-badge" v-if="!(pushTotal === 0)">{{pushTotal}}</span>
              <el-button class="drop-menu-bell" icon="el-icon-bell" @click="dialogFormVisible = true"></el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </Menu>
    <Modal v-model="modalVisible" :width="400">
      <div slot="header" class="modal-title">{{$t('m.Welcome_to')}} {{website.website_name_shortcut}}</div>
      <component :is="modalStatus.mode" v-if="modalVisible"></component>
      <div slot="footer" style="display: none"></div>
    </Modal>
    
    <el-dialog title="QnA 확인 알림 리스트" :modal=false :visible.sync="dialogFormVisible">
      <el-table :data="pushData" v-loading="loading">
        <el-table-column
          label="ID"
          prop="id">
        </el-table-column>
        <el-table-column
          label="수강과목"
          prop="problem.contest.lecture_title">
        </el-table-column>
        <el-table-column
          label="학번"
          prop="author.realname">
        </el-table-column>
        <el-table-column
          label="바로가기"
          align="center">
          <template slot-scope="{row}">
            <el-button icon="el-icon-monitor" name="바로가기"
                      @click.native="goContestQnA(row.lecture, row.contest, row.problem.id, row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :total="pushTotal" :pageSize="limit">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import login from '@oj/views/user/Login'
  import register from '@oj/views/user/Register'
  import api from '@oj/api'

  export default {
    data () {
      return {
        pushTotal: 0,
        pushData: '',
        limit: 10,
        public_qna: '공개질문',
        loading: false,
        gridData: [{
          date: '2016-05-02',
          name: 'John Smith',
          address: 'No.1518,  Jinshajiang Road, Putuo District'
        }, {
          date: '2016-05-04',
          name: 'John Smith',
          address: 'No.1518,  Jinshajiang Road, Putuo District'
        }, {
          date: '2016-05-01',
          name: 'John Smith',
          address: 'No.1518,  Jinshajiang Road, Putuo District'
        }, {
          date: '2016-05-03',
          name: 'John Smith',
          address: 'No.1518,  Jinshajiang Road, Putuo District'
        }],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
    },
    components: {
      login,
      register
    },
    mounted () {
      this.getProfile()
      this.qnapushlist()
    },
    methods: {
      ...mapActions(['getProfile', 'changeModalStatus']),
      qnapushlist () {
        let params = { offset: 0,
          limit: this.limit }
        api.PostListPushSerializer(params).then((res) => {
          this.pushTotal = res.data.data.total
          this.pushData = res.data.data.results
        })
      },
      currentChange (page) {
        let params = { offset: (page - 1) * this.limit,
          limit: this.limit }
        api.PostListPushSerializer(params).then((res) => {
          this.pushTotal = res.data.data.total
          this.pushData = res.data.data.results
        })
      },
      goContestQnA (lectureID, contestID, problemID, questionID) {
        this.$router.push({
          name: 'constest-problem-qna-detail',
          // path: '/CourseList/:lectureID/:contestID/question',
          params: {
            lectureID: lectureID,
            problemID: problemID,
            contestID: contestID,
            questionID: questionID
          }
        })
      },
      handleRoute (route) {
        if (route && route.indexOf('admin') < 0) {
          this.$router.push(route)
        } else {
          window.open('/admin/')
        }
      },
      handleBtnClick (mode) {
        this.changeModalStatus({
          visible: true,
          mode: mode
        })
      }
    },
    computed: {
      ...mapGetters(['website', 'modalStatus', 'user', 'isAuthenticated', 'isAdminRole']),
      // 跟随路由变化
      activeMenu () {
        // 여기서 이전 주소의 [1], [4]가 CourseList, problems 일때 return을 CourseList
        if (this.$route.path.split('/')[1] === 'contest' && parseInt(this.$route.path.split('/')[2]) > 0) {
          return '/' + 'CourseList'
        }
        return '/' + this.$route.path.split('/')[1]
      },
      modalVisible: {
        get () {
          return this.modalStatus.visible
        },
        set (value) {
          this.changeModalStatus({visible: value})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #header {
    min-width: 1100px;
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    .oj-menu {
      background: #fdfdfd;
    }

    .logo {
      margin-left: 2%;
      margin-right: 2%;
      font-size: 20px;
      float: left;
      line-height: 60px;
      #logo{
        width: 130px;
        padding-top: 5px;
      }
    }

    .drop-menu {
      float: right;
      margin-right: 30px;
      position: absolute;
      right: 25px;
      &-title {
        font-size: 18px;
      }
      &-bell {
        margin: 0 2px;
      }
    }
    .buttons {
      position:absolute;
      right:5px;
      bottom:5px;
      width: 100px;
    }
    .button-left {
      float:left;
      width:45px;
      margin: 0 2px
    }
    .button-right {
      float:right;
      width:45px;
      margin:0 2px;
    }
    .btn-menu {
      font-size: 16px;
      float: right;
      margin-right: 10px;
    }
  }
  .modal {
    &-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  .notify-badge{
    position: absolute;
    background: rgba(255,0,0,1);
    height:1.2rem;
    top:8px;
    right:-4px;
    width:1.2rem;
    text-align: center;
    line-height: 1rem;;
    font-size: 1rem;
    border-radius: 50%;
    color:white;
    border:1px solid red;
  }
</style>
