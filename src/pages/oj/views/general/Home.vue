<template>
  <Row type="flex" justify="space-around">
    <Col :span="22">
    <panel class="lecture">
      <div slot="title">
        나의 수강과목 진행 현황
      </div>
      <!-- DivTable.com -->
      <template v-for="pie in pielist">
        <h3>{{ pie.title }}</h3>
        <el-table
          :data="tablerow"
          border
          class="dashboard">
          <el-table-column
            label="실습"
            align="center">
            <Card>
              <div class="echarts">
                <ECharts :options="pie.pie_1"></ECharts>
              </div>
            </Card>
          </el-table-column>
          <el-table-column
            label="과제"
            align="center">
            <Card>
              <div class="echarts">
                <ECharts :options="pie.pie_2"></ECharts>
              </div>
            </Card>
          </el-table-column>
          
        </el-table>
      </template>
    </panel>
    <panel shadow v-if="contests.length" class="contest">
      <div slot="title">
        <Button type="text"  class="contest-title" @click="goContest">{{contests[index].title}}</Button>
      </div>
      <Table stripe :loading="loading" :disabled-hover="true" :columns="columns" :data="dashboard"></Table>
    </panel>
    <Announcements class="announcement"></Announcements>
    </Col>
  </Row>
</template>

<script>
  import Vue from 'vue'
  import Element from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  import Announcements from './Announcements.vue'
  import api from '@oj/api'
  import time from '@/utils/time'
  import { CONTEST_STATUS } from '@/utils/constants'

  Vue.use(Element)

  const pieColorMap = {
    '성공': {color: '#409EFF'},
    '시작 전': {color: '#F56C6C'},
    '도전 중': {color: '#E6A23C'},
    '진행도(%)': {color: '#67C23A'},
    '': {color: 'Transparent'},
    'CE': {color: '#80848f'},
    'PAC': {color: '#2d8cf0'}
  }

  function getItemColor (obj) {
    return pieColorMap[obj.name].color
  }

  export default {
    name: 'home',
    components: {
      Announcements
    },
    data () {
      return {
        pielist: [],
        tablerow: ['1'], // 테이블 출력 수 조절을 위한 값. 지우거나 값 수정하지 말 것
        lecturelist: [],
        contests: [],
        index: 0
      }
    },
    mounted () {
      let params = {status: CONTEST_STATUS.NOT_START}
      api.getContestList(0, 5, params).then(res => {
        this.contests = res.data.data.results
      })
      console.log('test')
      api.getDashboardinfo().then(res => {
        this.lecturelist = res.data.data.results
        this.lecturelist.forEach(lecture => {
          let jsonpie = {
            title: lecture.lecture.title, // 시도 - 해결 = 도전중
            pie_1: {
              legend: {
                left: '0', top: '5', orient: 'vertical', data: ['성공', '도전 중', '시작 전', '진행도(%)']
              },
              series: [
                {
                  name: 'Progress',
                  type: 'pie',
                  radius: ['83%', '88%'],
                  center: ['50%', '50%'],
                  itemStyle: {
                    normal: {color: getItemColor}
                  },
                  data: [
                    {
                      value: lecture.tryProblem + lecture.solveProblem, name: '진행도(%)' // 시도한 문제 + 해결한 문제
                    },
                    {
                      value: lecture.totalProblem - lecture.tryProblem - lecture.solveProblem, name: '' // 총 문제 수 - 시도한 문제 - 해결한 문제
                    }
                  ],
                  label: {
                    normal: {
                      show: false
                    }
                  },
                  hoverAnimation: false
                },
                {
                  name: 'Summary',
                  type: 'pie',
                  radius: '78%',
                  center: ['50%', '50%'],
                  itemStyle: {
                    normal: {color: getItemColor}
                  },
                  data: [
                    {
                      value: lecture.totalProblem - lecture.tryProblem - lecture.solveProblem, name: '시작 전'
                    },
                    {
                      value: lecture.tryProblem, name: '도전 중'
                    },
                    {
                      value: lecture.solveProblem, name: '성공'
                    }
                  ],
                  label: {
                    normal: {
                      margin: '0', show: true, formatter: '{b}: {c}\n {d}%', textStyle: {fontWeight: 'bold'}
                    }
                  },
                  hoverAnimation: false
                }
              ]
            },
            pie_2: {
              legend: {
                left: '0', top: '5', orient: 'vertical', data: ['성공', '도전 중', '시작 전', '진행도(%)']
              },
              series: [
                {
                  name: 'Progress',
                  type: 'pie',
                  radius: ['83%', '88%'],
                  center: ['50%', '50%'],
                  itemStyle: {
                    normal: {color: getItemColor}
                  },
                  data: [
                    {
                      value: lecture.tryProblem + lecture.solveProblem, name: '진행도(%)' // 시도한 문제 + 해결한 문제
                    },
                    {
                      value: lecture.totalProblem - lecture.tryProblem - lecture.solveProblem, name: '' // 총 문제 수 - 시도한 문제 - 해결한 문제
                    }
                  ],
                  label: {
                    normal: {
                      show: false
                    }
                  },
                  hoverAnimation: false
                },
                {
                  name: 'Summary',
                  type: 'pie',
                  radius: '78%',
                  center: ['50%', '50%'],
                  itemStyle: {
                    normal: {color: getItemColor}
                  },
                  data: [
                    {
                      value: lecture.totalProblem - lecture.tryProblem - lecture.solveProblem, name: '시작 전'
                    },
                    {
                      value: lecture.tryProblem, name: '도전 중'
                    },
                    {
                      value: lecture.solveProblem, name: '성공'
                    }
                  ],
                  label: {
                    normal: {
                      margin: '0', show: true, formatter: '{b}: {c}\n {d}%', textStyle: {fontWeight: 'bold'}
                    }
                  },
                  hoverAnimation: false
                }
              ]
            }
          }
          this.pielist.push(jsonpie)
        })
      })
    },
    methods: {
      getDuration (startTime, endTime) {
        return time.duration(startTime, endTime)
      },
      goContest () {
        this.$router.push({
          name: 'contest-details',
          params: {contestID: this.contests[this.index].id}
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  h3 {
    padding-left: 25px;
  }

  .dashboard {
    margin-left: 25px;
    margin-bottom: 15px;
    margin-top: 10px;
    width: 97%;
  }

  .contest {
    &-title {
      font-style: italic;
      font-size: 21px;
    }
    &-content {
      padding: 0 70px 40px 70px;
      &-description {
        margin-top: 25px;
      }
    }
  }

  .announcement {
    margin-top: 20px;
  }

  .lecturetitle{
    margin-left: 25px;
    font-size: 21px;
  }

  /* DivTable.com */
  .divTable{
    margin: 0 auto;
    display: table;
    width: 50%;
    padding-bottom: 20px;
  }
  .divTableRow {
    display: table-row;
  }
  .divTableHeading {
    background-color: #EEE;
    display: table-header-group;
  }
  .divTableCell, .divTableHead {
    border: 1px solid #999999;
    display: table-cell;
    text-align: center;
  }
  .divScore{
    border: 1px solid #999999;
    display: table-cell;
    text-align: center;
  }
  .divTableHeading {
    background-color: #EEE;
    display: table-header-group;
    font-weight: bold;
  }
  .divTableFoot {
    background-color: #EEE;
    display: table-footer-group;
    font-weight: bold;
  }
  .divTableBody {
    display: table-row-group;
  }
</style>

<style scoped lang="less">
  .echarts {
    margin: 0 auto;
    width: 95%;
    height: 400px;
  }
</style>
