<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-select v-model="year">
          <el-option value="2020">2020</el-option>
          <el-option value="2021">2021</el-option>
          <el-option value="2022">2022</el-option>
          <el-option value="2022">2023</el-option>
          <el-option value="2022">2024</el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="semester">
          <el-option value="1">1학기</el-option>
          <el-option value="2">2학기</el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-input
          v-model="keyword"
          placeholder="Keywords"
          prefix-icon="el-icon-search"
          width="300">
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button @click="onYearChange">검색</el-button>
      </el-col>
    </el-row>
    <el-table :data="contests" v-loading="loading">
      <el-table-column
        label="ID"
        width="70"
        prop="id">
      </el-table-column>
      <el-table-column
        label="생성자"
        width="70"
        prop="created_by.realname">
      </el-table-column>
      <el-table-column
        label="생성일자"
        width="150">
        <template slot-scope="props">
          {{ props.row.create_time | localtime }}
        </template>
      </el-table-column>
      <el-table-column
        label="소속 수강과목"
        width="150"
        prop="lecture_title">
      </el-table-column>
      <el-table-column
        label="실습, 과제, 대회명"
        prop="title">
      </el-table-column>
      <el-table-column
        label="추가하기"
        align="center"
        width="100"
        fixed="right">
        <template slot-scope="{row}">
          <icon-btn icon="plus" name="Add the Contest"
                    @click.native="handleAddContest(row.id)"></icon-btn>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page"
      layout="prev, pager, next"
      @current-change="getPublicContest"
      :page-size="limit"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import api from '@admin/api'

  export default {
    name: 'add-contest-from-public',
    props: ['lectureID'],
    data () {
      return {
        year: 0,
        semester: 1,
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        contests: [],
        lecture: {},
        keyword: '',
        dropdown: ''
      }
    },
    mounted () {
      api.getLecture(this.lectureID).then(res => {
        this.lecture = res.data.data
        console.log(this.lecture)
        this.getPublicContest()
      }).catch(() => {
      })
    },
    methods: {
      getPublicContest (page) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          offset: (page - 1) * this.limit,
          limit: this.limit,
          year: this.year
        }
        api.getContestList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.contests = res.data.data.results
        }).catch(() => {
        })
      },
      handleAddContest (contestID) {
        let data = {
          contest_id: contestID,
          lecture_id: this.lectureID
        }
        api.addContestFromPublic(data).then(() => {
          this.$emit('on-change')
        }, () => {
        })
      },
      onYearChange (page) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          offset: (page - 1) * this.limit,
          limit: this.limit,
          year: this.year
        }
        api.getContestList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.contests = res.data.data.results
        }).catch(() => {
        })
      }
    },
    watch: {
      'keyword' () {
        this.getPublicContest(this.page)
      }
    }
  }
</script>
<style scoped>
  .page {
    margin-top: 20px;
    text-align: right
  }

</style>
