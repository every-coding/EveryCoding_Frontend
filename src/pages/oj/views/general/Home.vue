<template>
  <Row type="flex" justify="space-around">
    <Col :span="22">
    <panel>
      <div slot="title">
        나의 수강과목 진행 현황
      </div>
      <div class="echarts">
        <ECharts :options="options" ref="chart" auto-resize></ECharts>
      </div>
      <div class="lecturetitle">
        강의별 현황
      </div>
      <div>
        <div class="lecturetitle">
          코딩: 생각을현실로
        </div>
        <div class="divTable">
          <div class="divTableBody">
            <div class="divTableRow">
              <div class="divTableCell">&nbsp;실습<br/>(총계/도전/성공)</div>
              <div class="divTableCell">과제<br/>(총계/도전/성공)&nbsp;</div>
              <div class="divTableCell">문제<br/>(총계/도전/성공)&nbsp;</div>
            </div>
            <div class="divTableRow">
              <div class="divTableCell">&nbsp;3/2/2</div>
              <div class="divTableCell">1/1/1&nbsp;</div>
              <div class="divTableCell">20/10/10&nbsp;</div>
            </div>
            <div class="divTableRow">
              <div class="divScore">20%&nbsp;</div>
              <div class="divScore">30%&nbsp;</div>
              <div class="divScore">20%&nbsp;</div>
            </div>
          </div>
        </div>
      </div>

      <!-- DivTable.com -->
    </panel>
    <panel shadow v-if="contests.length" class="contest">
      <div slot="title">
        <Button type="text"  class="contest-title" @click="goContest">{{contests[index].title}}</Button>
      </div>
      <Carousel v-model="index" trigger="hover" autoplay :autoplay-speed="6000" class="contest">
        <CarouselItem v-for="(contest, index) of contests" :key="index">
          <div class="contest-content">
            <div class="contest-content-tags">
              <Button type="info" shape="circle" size="small" icon="calendar">
                {{contest.start_time | localtime('YYYY-M-D HH:mm') }}
              </Button>
              <Button type="success" shape="circle" size="small" icon="android-time">
                {{getDuration(contest.start_time, contest.end_time)}}
              </Button>
              <Button type="warning" shape="circle" size="small" icon="trophy">
                {{contest.rule_type}}
              </Button>
            </div>
            <div class="contest-content-description">
              <blockquote v-html="contest.description"></blockquote>
            </div>
          </div>
        </CarouselItem>
      </Carousel>
    </panel>
    <Announcements class="announcement"></Announcements>
    </Col>
  </Row>
</template>

<script>
  import Announcements from './Announcements.vue'
  import api from '@oj/api'
  import time from '@/utils/time'
  import { CONTEST_STATUS } from '@/utils/constants'

  export default {
    name: 'home',
    components: {
      Announcements
    },
    data () {
      return {
        contests: [],
        index: 0,
        options: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['전체 진행률', '실습', '과제']
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0]
          },
          yAxis: {
            type: 'category',
            data: ['코딩:생각을현실로', '자바프로그래밍실습']
          },
          series: [
            {
              name: '전체 진행률',
              type: 'bar',
              data: [80, 100]
            },
            {
              name: '실습',
              type: 'bar',
              data: [100, 100]
            },
            {
              name: '과제',
              type: 'bar',
              data: [70, 100]
            }
          ]
        }
      }
    },
    mounted () {
      let params = {status: CONTEST_STATUS.NOT_START}
      api.getContestList(0, 5, params).then(res => {
        this.contests = res.data.data.results
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
