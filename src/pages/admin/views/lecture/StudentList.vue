<template>
  <div class="view">
    <Panel :title="$t('m.Lecture_UserList') ">
      <div slot="header">
        <el-row :gutter="20">
          <el-col :span="selectedUsers.length ? 16: 24">
            <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="Keywords"></el-input>
          </el-col>
        </el-row>
      </div>
      <strong>총 수강 학생 : {{ userList.length }}명</strong>
      <el-table
        v-loading="loadingTable"
        element-loading-text="loading"
        @selection-change="handleSelectionChange"
        ref="table"
        :data="userList"
        style="width: 100%">
        <el-table-column prop="realname" label="실제 이름">
          <template slot-scope="scope"><!--lecture_signup_class에 실제 이름이 있는 경우,-->
            <span v-if="scope.row.realname"><!--해당 값을 출력하고-->
              {{ scope.row.realname }}
            </span>
            <span v-else><!--아닌 경우에는 User 테이블에 있는 realname 값을 출력한다.-->
              {{ scope.row.user.realname }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="schoolssn" label="학번">
          <template slot-scope="scope"><!--마찬가지로 lecture_signup_class에 학번이 있는 경우,-->
            <span v-if="scope.row.schoolssn"><!--해당 값을 출력하고-->
              {{ scope.row.schoolssn }}
            </span>
            <span v-else><!--아닌 경우에는 User 테이블에 있는 schoolssn 값을 출력한다.-->
              {{ scope.row.user.schoolssn }}
            </span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="real_name" label="실제 이름"></el-table-column>// 사용자명을 실제 이름으로 할 것 같은데, 필요한지?-->

        <el-table-column prop="user.email" label="이메일" width="180"></el-table-column>
        <el-table-column prop="isallow" label="수강 유무">
          <template slot-scope="scope"> <!--true 일 때 출력하는 템플릿-->
            <span v-if="scope.row.isallow" style="background-color:green; color:white">
              {{ scope.row.isallow }}
            </span>
            <span v-else style="background-color:red; color:white">
              {{ scope.row.isallow }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="totalProblem" label="총 문제 수" width="90"></el-table-column>
        <el-table-column prop="solveProblem" label="해결 수" width="90"></el-table-column>
        <el-table-column prop="totalScore" label="총점" width="90"></el-table-column>
        <el-table-column prop="maxScore" label="최대점" width="90"></el-table-column>
        <el-table-column prop="avgScore" label="평균" width="90"></el-table-column>
        <!--<el-table-column prop="user.admin_type" label="사용자 유형">
          <template slot-scope="scope">
            {{ scope.row.user.admin_type }}
          </template>
        </el-table-column>-->
        
        <el-table-column fixed="right" label="" width="200">
          <template slot-scope="{row}">
            <icon-btn name="Accept" icon="edit" @click.native="AcceptStudent(row.user.id)"></icon-btn>
            <icon-btn name="Deny" icon="trash" @click.native="DenyStudent(row.user.id)"></icon-btn>
          </template>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
    <Panel>
      <span slot="title">{{$t('m.Import_Student')}}
        <el-popover placement="right" trigger="hover">
          <p>설명 입력</p>
          <i slot="reference" class="el-icon-fa-question-circle import-user-icon"></i>
        </el-popover>
      </span>
      <el-upload v-if="!uploadUsers.length"
                 action=""
                 :show-file-list="false"
                 accept=".csv"
                 :before-upload="handleUsersCSV">
        <el-button size="small" icon="el-icon-fa-upload" type="primary">엑셀 파일 선택 (.csv 확장자)</el-button><!--엑셀 형태의 사용자 정보 파일 가져오는 기능-->
      </el-upload>
      <template v-else>
        <el-table :data="uploadUsersPage">
          <el-table-column label="학번">
            <template slot-scope="{row}">
              {{row[0]}}
            </template>
          </el-table-column>
          <el-table-column label="이름">
            <template slot-scope="{row}">
              {{row[1]}}
            </template>
          </el-table-column>
        </el-table>
        <div class="panel-options">
          <el-button type="primary" size="small"
                     icon="el-icon-fa-upload"
                     @click="handleUsersUpload">Import All
          </el-button>
          <el-button type="warning" size="small"
                     icon="el-icon-fa-undo"
                     @click="handleResetData">Reset Data
          </el-button>
          <el-pagination
            class="page"
            layout="prev, pager, next"
            :page-size="uploadUsersPageSize"
            :current-page.sync="uploadUsersCurrentPage"
            :total="uploadUsers.length">
          </el-pagination>
        </div>
      </template>
    </Panel>
  </div>
</template>
<script>
  import papa from 'papaparse'
  import iconv from 'iconv-lite'
  import api from '../../api.js'
  import utils from '@/utils/utils'

  export default {
    name: 'User',
    data () {
      return {
        lectureID: '',
        // 一页显示的用户数
        pageSize: 50,
        // 用户总数
        total: 0,
        // 用户列表
        userList: [],
        uploadUsers: [],
        uploadUsersPage: [],
        uploadUsersCurrentPage: 1,
        uploadUsersPageSize: 15,
        // 搜索关键字
        keyword: '',
        // 是否显示用户对话框
        showUserDialog: false,
        // 当前用户model
        user: {},
        loadingTable: false,
        loadingGenerate: false,
        // 当前页码
        currentPage: 0,
        selectedUsers: [],
        formGenerateUser: {
          prefix: '',
          suffix: '',
          number_from: 0,
          number_to: 0,
          password_length: 8
        }
      }
    },
    mounted () {
      this.lectureID = this.$route.params.lectureId
      this.getUserList(1)
      console.log(this.lectureID)
    },
    methods: {
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getUserList(page)
      },
      AcceptStudent (userid) {
        console.log(userid)
        let data = {
          lecture_id: this.lectureID,
          user_id: userid
        }
        console.log(data)
        api.acceptStudent(data).then(res => {
          this.getUserList(this.page)
          this.$success('Success')
        })
      },
      DenyStudent (userid) {
        this.$confirm('해당 학생의 수강신청을 삭제하시겠습니까?', 'confirm', {
          type: 'warning'
        }).then(() => {
          console.log('userid : ' + userid)
          api.denyStudent(userid, this.lectureID).then(res => {
            this.getUserList(this.page)
          }).catch(() => {
            this.getUserList(this.page)
          })
        }, () => {
        })
      },
      saveUser () {
        api.editUser(this.user).then(res => {
          // 更新列表
          this.getUserList(this.currentPage)
        }).then(() => {
          this.showUserDialog = false
        }).catch(() => {
        })
      },
      // 打开用户对话框
      openUserDialog (id) {
        this.showUserDialog = true
        api.getUser(id).then(res => {
          this.user = res.data.data
          this.user.password = ''
          this.user.real_tfa = this.user.two_factor_auth
        })
      },
      // 获取用户列表
      getUserList (page) {
        this.loadingTable = true
        api.getLectureUserList((page - 1) * this.pageSize, this.pageSize, this.keyword, this.lectureID).then(res => {
          this.loadingTable = false
          this.total = res.data.data.total
          this.userList = res.data.data.results
          // console.log(this.userList)
        }, res => {
          this.loadingTable = false
        })
      },
      handleSelectionChange (val) {
        this.selectedUsers = val
      },
      generateUser () {
        this.$refs['formGenerateUser'].validate((valid) => {
          if (!valid) {
            this.$error('Please validate the error fields')
            return
          }
          this.loadingGenerate = true
          let data = Object.assign({}, this.formGenerateUser)
          api.generateUser(data).then(res => {
            this.loadingGenerate = false
            let url = '/admin/generate_user?file_id=' + res.data.data.file_id
            utils.downloadFile(url).then(() => {
              this.$alert('All users created successfully, the users sheets have downloaded to your disk.', 'Notice')
            })
            this.getUserList(1)
          }).catch(() => {
            this.loadingGenerate = false
          })
        })
      },
      handleUsersCSV (file) {
        papa.parse(file, {
          encoding: 'euc-kr',
          complete: (results) => {
            let data = results.data.filter(user => {
              return user[0] && user[1]
            })
            let delta = results.data.length - data.length
            if (delta > 0) {
              this.$warning(delta + ' users have been filtered due to empty value')
            }
            this.uploadUsersCurrentPage = 1
            this.uploadUsers = data
            this.uploadUsersPage = data.slice(0, this.uploadUsersPageSize)
          },
          error: (error) => {
            this.$error(error)
          }
        })
      },
      handleUsersUpload () {
        console.log(this.uploadUsers)
        let aJson = []
        aJson.push(-1)
        aJson.push(this.$route.params.lectureId)
        this.uploadUsers.unshift(aJson)
        api.importStudents(this.uploadUsers).then(res => {
          this.getUserList(1)
          this.handleResetData()
        }).catch(() => {
        })
      },
      handleResetData () {
        this.uploadUsers = []
      }
    },
    computed: {
      selectedUserIDs () {
        let ids = []
        for (let user of this.selectedUsers) {
          ids.push(user.id)
        }
        return ids
      }
    },
    watch: {
      'keyword' () {
        this.currentChange(1)
      },
      'user.admin_type' () {
        if (this.user.admin_type === 'Super Admin') {
          this.user.problem_permission = 'All'
        } else if (this.user.admin_type === 'Regular User') {
          this.user.problem_permission = 'None'
        }
      },
      'uploadUsersCurrentPage' (page) {
        this.uploadUsersPage = this.uploadUsers.slice((page - 1) * this.uploadUsersPageSize, page * this.uploadUsersPageSize)
      }
    }
  }
</script>

<style scoped lang="less">
  .import-user-icon {
    color: #555555;
    margin-left: 4px;
  }

  .userPreview {
    padding-left: 10px;
  }

  .notification {
    p {
      margin: 0;
      text-align: left;
    }
  }
</style>
