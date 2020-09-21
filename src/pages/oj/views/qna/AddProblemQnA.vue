<template>
  <div>
    <h2 class="span-title">제목</h2>
    <el-input
      v-model="keyword"
      placeholder="title">
    </el-input>
  </div>
</template>
<script>
  export default {
    name: 'add-problem-qna',
    props: ['infomation'],
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        problems: [],
        contest: {},
        keyword: '',
        showPublic: false,
        searchType: '문제'
      }
    },
    mounted () {
      this.getPublicProblem()
    },
    methods: {
      getPublicProblem () {
        console.log(this.infomation)
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
