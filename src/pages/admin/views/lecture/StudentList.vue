<template>
  <div class="view">
    <Panel :title="this.lectureTitle + ' ' + $t('m.Lecture_UserList')">
      <div>
        <strong>개설자 : {{ this.lectureFounder }}</strong>
      </div>
      <div slot="header">
        <el-row :gutter="20">
          <el-col :span="selectedUsers.length ? 16: 24">
            <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="Keywords"></el-input>
          </el-col>
        </el-row>
      </div>
      <strong>총 수강 학생/등록/미등록 : {{ userList.length }}명 / {{ RegistUser }}명 / {{ noRegistUser }}명</strong>
      <!---->
      <template>
        <el-tabs v-model="activeName">
          <el-tab-pane label="종합" name="synthesis">
            <el-table
              v-loading="loadingTable"
              element-loading-text="loading"
              @selection-change="handleSelectionChange"
              ref="table"
              :data="userList"
              style="width: 100%">
              <el-table-column prop="realname" label="이름" align="center">
                <template slot-scope="scope"><!--lecture_signup_class에 실제 이름이 있는 경우,-->
                  <span v-if="scope.row.realname"><!--해당 값을 출력하고-->
                    {{ scope.row.realname }}
                  </span>
                  <span v-else><!--아닌 경우에는 User 테이블에 있는 realname 값을 출력한다.-->
                    {{ scope.row.user.realname }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="schoolssn" label="학번" align="center">
                <template slot-scope="scope"><!--마찬가지로 lecture_signup_class에 학번이 있는 경우,-->
                  <span v-if="scope.row.schoolssn"><!--해당 값을 출력하고-->
                    {{ scope.row.schoolssn }}
                  </span>
                  <span v-else><!--아닌 경우에는 User 테이블에 있는 schoolssn 값을 출력한다.-->
                    {{ scope.row.user.schoolssn }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="isallow" label="수강 유무" align="center">
                <template slot-scope="scope"> <!--true 일 때 출력하는 템플릿-->
                  <span v-if="scope.row.isallow" style="background-color:green; color:white">
                    {{ scope.row.isallow }}
                  </span>
                  <span v-else style="background-color:red; color:white">
                    {{ scope.row.isallow }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="총실습/도전/해결" align="center">
                <template slot-scope="scope">
                  <span style="text-align:center">
                    {{ scope.row.totalPractice }}/{{ scope.row.subPractice }}/{{ scope.row.solvePractice }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="총과제/도전/해결" align="center">
                <template slot-scope="scope">
                  <span style="text-align:center">
                    {{ scope.row.totalAssign }}/{{ scope.row.subAssign }}/{{ scope.row.solveAssign }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="총문제/도전/해결" align="center">
                <template slot-scope="scope">
                  <span style="text-align:center">
                    {{ scope.row.totalProblem }}/{{ scope.row.tryProblem }}/{{ scope.row.solveProblem }}
                  </span>
                </template>
              </el-table-column>
              
              <el-table-column prop="maxScore" label="만점" width="90" align="center"></el-table-column>
              <el-table-column prop="totalScore" label="총점" width="90" align="center"></el-table-column>
              <el-table-column prop="avgScore" label="평균" width="90" align="center"></el-table-column>
              <el-table-column prop="progress" label="진행율" width="90" align="center"></el-table-column>
              
              <el-table-column fixed="right" label="" width="200">
                <template slot-scope="{row}">
                  <icon-btn name="Accept" icon="edit" @click.native="AcceptStudent(row.user.id)"></icon-btn>
                  <icon-btn name="Deny" icon="trash" @click.native="DenyStudent(row.id)"></icon-btn>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!---->
          <el-tab-pane label="실습" name="train">
            <table>
              <thead>
                <tr>
                  <th>
                    이름
                  </th>
                  <th>
                    학번
                  </th>
                  <template v-for="(contests, index) in scoreListTable['0'].score.traincolumnscore.contests">
                    <th>
                      {{ index + 1 }}주차
                    </th>
                  </template>
                  <th>
                    총점
                  </th>
                  <th>
                    평균
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in scoreListTable">
                  <td>
                    {{ user.realname }}
                  </td>
                  <td>
                    {{ user.schoolssn }}
                  </td>
                  <td v-for="contest in user.score.traincolumnscore.contests">
                    {{ contest.Info.score }}
                  </td>
                  <td>
                    {{ user.score.traincolumnscore.totalscore }}
                  </td>
                  <td>
                    {{ user.score.traincolumnscore.avg }}
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <!---->
          <el-tab-pane label="과제" name="assign">
            <table>
              <thead>
                <tr>
                  <th>
                    이름
                  </th>
                  <th>
                    학번
                  </th>
                  <template v-for="(contests, index) in scoreListTable['0'].score.assigncolumnscore.contests">
                    <th>
                      {{ index + 1 }}주차
                    </th>
                  </template>
                  <th>
                    총점
                  </th>
                  <th>
                    평균
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in scoreListTable">
                  <td>
                    {{ user.realname }}
                  </td>
                  <td>
                    {{ user.schoolssn }}
                  </td>
                  <td v-for="contest in user.score.assigncolumnscore.contests">
                    {{ contest.Info.score }}
                  </td>
                  <td>
                    {{ user.score.assigncolumnscore.totalscore }}
                  </td>
                  <td>
                    {{ user.score.assigncolumnscore.avg }}
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <!---->
          <el-tab-pane label="대회" name="contest">
            <table>
              <thead>
                <tr>
                  <th>
                    이름
                  </th>
                  <th>
                    학번
                  </th>
                  <template v-for="(contests, index) in scoreListTable['0'].score.contestcolumnscore.contests">
                    <th>
                      {{ index + 1 }}주차
                    </th>
                  </template>
                  <th>
                    총점
                  </th>
                  <th>
                    평균
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in scoreListTable">
                  <td>
                    {{ user.realname }}
                  </td>
                  <td>
                    {{ user.schoolssn }}
                  </td>
                  <td v-for="contest in user.score.contestcolumnscore.contests">
                    {{ contest.Info.score }}
                  </td>
                  <td>
                    {{ user.score.contestcolumnscore.totalscore }}
                  </td>
                  <td>
                    {{ user.score.contestcolumnscore.avg }}
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <!---->
          <el-tab-pane label="Excel export" name="export">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="실습"></el-checkbox>
              <el-checkbox label="과제"></el-checkbox>
              <el-checkbox label="대회"></el-checkbox>
            </el-checkbox-group>
            <el-button type="primary">Export excel</el-button>
          </el-tab-pane>
          <!---->
        </el-tabs>
      </template>
      <!---->
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
          <p><img src="./example.png"/></p>
          <span>위 이미지와 동일한 형태로 존재하는 엑셀 학생 리스트를 가져올 수 있습니다.</span></br>
          <span>학생 이름이 ?와 같이 표시되는 경우, 인코딩 방식을 utf-8로 변경하여야 합니다.</span>
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
              {{ row[0] }}
            </template>
          </el-table-column>
          <el-table-column label="이름">
            <template slot-scope="{row}">
              {{ row[1] }}
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
  import api from '../../api.js'
  import utils from '@/utils/utils'

  export default {
    name: 'User',
    data () {
      return {
        checkList: ['실습', '과제', '대회'],
        // activeName: 'synthesis', // 페이지 내 여러 탭 표현을 위한 변수, synthesis와 동일한 name을 가진 pane이 default로 출력된다.
        activeName: 'train', // 임시 지정
        showContestDialog: false,
        lectureID: '',
        lectureFounder: '', // 강의 개설자 realname
        lectureTitle: '', // 수강과목 title
        pageSize: 50,
        total: 0,
        RegistUser: 0,
        noRegistUser: 0,
        userList: [],
        scoreListTable: [],
        uploadUsers: [],
        uploadUsersPage: [],
        uploadUsersCurrentPage: 1,
        uploadUsersPageSize: 15,
        // 학생 유형별 카운트
        signup: 0, // 정상 수강 인원
        notgegistered: 0, // 미등록된 인원
        outoflecture: 0, // 정원 외 인원 (학생 개인 임의 수강신청)
        keyword: '',
        showUserDialog: false,
        user: {},
        loadingTable: false,
        loadingGenerate: false,
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
      this.lectureTitle = this.$route.params.lectureTitle
      this.lectureFounder = this.$route.params.lectureFounder
      this.getUserList(1)
    },
    methods: {
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
      DenyStudent (id) {
        this.$confirm('해당 학생의 수강신청을 삭제하시겠습니까?', 'confirm', {
          type: 'warning'
        }).then(() => {
          api.denyStudent(id, this.lectureID).then(res => {
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
          this.contestCount = this.userList[0].score.ContestAnalysis.실습.Info.numofcontents
          this.userList.forEach(user => {
            if (user.score !== null) {
              var userinfo = {}
              userinfo['realname'] = user.realname
              userinfo['schoolssn'] = user.schoolssn
              var trains = []
              var assigns = []
              var contests = []
              for (var i in user.score.ContestAnalysis.실습.contests) {
                trains.push(user.score.ContestAnalysis.실습.contests[i])
              }
              for (var j in user.score.ContestAnalysis.과제.contests) {
                assigns.push(user.score.ContestAnalysis.과제.contests[j])
              }
              for (var k in user.score.ContestAnalysis.대회.contests) {
                contests.push(user.score.ContestAnalysis.대회.contests[k])
              }
              var columnscore = {
                traincolumnscore: {
                  contests: trains,
                  totalscore: user.score.ContestAnalysis.실습.Info.score,
                  avg: user.score.ContestAnalysis.실습.Info.score / user.score.ContestAnalysis.실습.Info.numofcontents
                },
                assigncolumnscore: {
                  contests: assigns,
                  totalscore: user.score.ContestAnalysis.과제.Info.score,
                  avg: user.score.ContestAnalysis.과제.Info.score / user.score.ContestAnalysis.과제.Info.numofcontents
                },
                contestcolumnscore: {
                  contests: contests,
                  totalscore: user.score.ContestAnalysis.대회.Info.score,
                  avg: user.score.ContestAnalysis.대회.Info.score / user.score.ContestAnalysis.대회.Info.numofcontents
                }
              }
              userinfo.score = columnscore
              this.scoreListTable.push(userinfo)
            }
          })
          this.noRegistUser = 0
          for (let uu of this.userList) {
            if (uu.isallow === false) {
              this.noRegistUser = this.noRegistUser + 1
            }
          }
          this.RegistUser = this.userList.length - this.noRegistUser
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

  table {
    width: 100%;
  }

  tr {
    border-bottom: 1.5px solid rgba(220, 220, 220, 0.5);
  }

  th {
    color: rgba(75, 75, 75, 0.5);
  }

  td {
    text-align: center;
  }

  th, td {
    min-width: 100px;
    padding: 20px;
    border-bottom: 1.5px solid rgba(220, 220, 220, 0.5);
  }
</style>
