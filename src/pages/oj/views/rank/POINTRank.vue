<template>
  <Row type="flex" justify="space-around">
    <Col :span="22">
      <Panel :padding="10">
        <div slot="title">{{$t('m.POINT_Ranklist')}}</div>
        <div class="echarts">
          <ECharts :options="options" ref="chart" autoresize></ECharts>
        </div>
      </Panel>
      <Table :data="dataRank" :columns="columns" :loading="loadingTable" size="large"></Table>
      <Pagination :total="total" :page-size.sync="limit" :current.sync="page"
                  @on-change="getPointRankData" show-sizer
                  @on-page-size-change="getPointRankData(1)"></Pagination>
    </Col>
  </Row>
</template>

<script>
import api from '@oj/api'
import Pagination from '@oj/components/Pagination'
import utils from '@/utils/utils'
import { RULE_TYPE } from '@/utils/constants'

export default {
  name: 'point-rank',
  components: {
    Pagination
  },
  data () {
    return {
      page: 1,
      limit: 30,
      total: 0,
      loadingTable: false,
      dataRank: [],
      columns: [
        {
          align: 'center',
          width: 60,
          render: (h, params) => {
            return h('span', {}, params.index + (this.page - 1) * this.limit + 1)
          }
        },
        {
          title: this.$i18n.t('m.User_User'),
          align: 'center',
          render: (h, params) => {
            return h('a', {
              style: {
                'display': 'inline-block',
                'max-width': '200px'
              },
              on: {
                click: () => {
                  this.$router.push(
                    {
                      name: 'user-home',
                      query: {username: params.row.user.username}
                    })
                }
              }
            }, params.row.user.username)
          }
        },
        // {
        //   title: this.$i18n.t('m.mood'),
        //   align: 'center',
        //   key: 'mood'
        // },
        {
          title: this.$i18n.t('m.point'),
          align: 'center',
          key: 'accepted_number'
        },
        {
          title: this.$i18n.t('m.tear'),
          align: 'center',
          key: 'tear_number'
        },
        {
          title: this.$i18n.t('m.Rating'),
          align: 'center',
          render: (h, params) => {
            return h('span', utils.getACRate(params.row.accepted_number, params.row.submission_number))
          }
        }
      ],
      options: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [this.$i18n.t('m.point'), this.$i18n.t('m.tear')]
        },
        grid: {
          x: '3%',
          x2: '3%'
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {show: true, readOnly: true},
            magicType: {show: true, type: ['line', 'bar', 'stack']},
            saveAsImage: {show: true}
          },
          right: '10%'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['root'],
            axisLabel: {
              interval: 0,
              showMinLabel: true,
              showMaxLabel: true,
              align: 'center',
              formatter: (value, index) => {
                return utils.breakLongWords(value, 10)
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.$i18n.t('m.point'),
            type: 'bar',
            data: [0],
            markPoint: {
              data: [
                {type: 'max', name: 'max'}
              ]
            }
          },
          {
            name: this.$i18n.t('m.tear'),
            type: 'bar',
            data: [0],
            markPoint: {
              data: [
                {type: 'max', name: 'max'}
              ]
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.getPointRankData(1)
  },
  methods: {
    getPointRankData (page) {
      let offset = (page - 1) * this.limit
      let bar = this.$refs.chart
      bar.showLoading({maskColor: 'rgba(250, 250, 250, 0.8)'})
      this.loadingTable = true
      api.getPointRank(offset, this.limit, RULE_TYPE.POINT).then(res => {
        this.loadingTable = false
        if (page === 1) {
          this.changeCharts(res.data.data.results.slice(0, 10))
        }
        this.total = res.data.data.total
        this.dataRank = res.data.data.results
        bar.hideLoading()
      }).catch(() => {
        this.loadingTable = false
        bar.hideLoading()
      })
    },
    changeCharts (rankData) {
      let [usernames, pointData, tearData] = [[], [], []]
      rankData.forEach(ele => {
        usernames.push(ele.user.username)
        pointData.push(ele.accepted_number)
        tearData.push(ele.tear_number)
      })
      this.options.xAxis[0].data = usernames
      this.options.series[0].data = pointData
      this.options.series[1].data = tearData
    }
  }
}
</script>

<style scoped lang="less">
.echarts {
  margin: 0 auto;
  width: 95%;
  height: 400px;
}
</style>
