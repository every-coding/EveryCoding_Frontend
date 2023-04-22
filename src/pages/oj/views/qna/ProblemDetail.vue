<template>
  <div>
    <div id="problem-content" class="markdown-body" v-katex>
      <p class="title">{{$t('m.Description')}}</p>
      <p class="content" v-html=problem.description></p>
      <!-- {{$t('m.music')}} -->
      <p class="title">{{$t('m.Input')}} <span v-if="problem.io_mode.io_mode=='File IO'">({{$t('m.FromFile')}}: {{ problem.io_mode.input }})</span></p>
      <p class="content" v-html=problem.input_description></p>

      <p class="title">{{$t('m.Output')}} <span v-if="problem.io_mode.io_mode=='File IO'">({{$t('m.ToFile')}}: {{ problem.io_mode.output }})</span></p>
      <p class="content" v-html=problem.output_description></p>

      <div v-for="(sample, index) of problem.samples" :key="index">
        <div class="flex-container sample">
          <div class="sample-input">
            <p class="title">{{$t('m.Sample_Input')}} {{index + 1}}
              <a class="copy"
                 v-clipboard:copy="sample.input"
                 v-clipboard:success="onCopy"
                 v-clipboard:error="onCopyError">
                <Icon type="clipboard"></Icon>
              </a>
            </p>
            <pre>{{sample.input}}</pre>
          </div>
          <div class="sample-output">
            <p class="title">{{$t('m.Sample_Output')}} {{index + 1}}</p>
            <pre>{{sample.output}}</pre>
          </div>
        </div>
      </div>

      <div v-if="problem.hint">
        <p class="title">{{$t('m.Hint')}}</p>
        <Card dis-hover>
          <div class="content" v-html=problem.hint></div>
        </Card>
      </div>

      <div v-if="problem.source">
        <p class="title">{{$t('m.Source')}}</p>
        <p class="content">{{problem.source}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@oj/api'

  export default {
    name: 'qna-problem-detail',
    props: ['probID', 'contID'],
    data () {
      return {
        problem: {
          title: '',
          description: '',
          hint: '',
          my_status: '',
          template: {},
          languages: [],
          created_by: {
            username: ''
          },
          tags: [],
          io_mode: {'io_mode': 'Standard IO'}
        },
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
        api.getContestProblem(this.probID, this.contID).then(res => {
          console.log(res)
          this.$Loading.finish()
          let problem = res.data.data
          problem.languages = problem.languages.sort()
          this.problem = problem
          this.changePie(problem)

          // 在beforeRouteEnter中修改了, 说明本地有code，无需加载template
          if (this.code !== '') {
            return
          }
          // try to load problem template
          this.language = this.problem.languages[0]
        }, () => {
          this.$Loading.error()
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .card-title {
    margin-left: 8px;
  }

  .flex-container {
    #problem-main {
      flex: auto;
      margin-right: 18px;
    }
    #right-column {
      flex: none;
      width: 220px;
    }
  }

  #problem-content {
    margin-top: -50px;
    .title {
      font-size: 20px;
      font-weight: 400;
      margin: 25px 0 8px 0;
      color: #407a2d;
      .copy {
        padding-left: 8px;
      }
    }
    p.content {
      margin-left: 25px;
      margin-right: 20px;
      font-size: 15px
    }
    .sample {
      align-items: stretch;
      &-input, &-output {
        width: 50%;
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        margin-right: 5%;
      }
      pre {
        flex: 1 1 auto;
        align-self: stretch;
        border-style: solid;
        background: transparent;
      }
    }
  }

  #submit-code {
    margin-top: 20px;
    margin-bottom: 20px;
    .status {
      float: left;
      span {
        margin-right: 10px;
        margin-left: 10px;
      }
    }
    .captcha-container {
      display: inline-block;
      .captcha-code {
        width: auto;
        margin-top: -20px;
        margin-left: 20px;
      }
    }
  }

  #info {
    margin-bottom: 20px;
    margin-top: 20px;
    ul {
      list-style-type: none;
      li {
        border-bottom: 1px dotted #e9eaec;
        margin-bottom: 10px;
        p {
          display: inline-block;
        }
        p:first-child {
          width: 90px;
        }
        p:last-child {
          float: right;
        }
      }
    }
  }

  .fl-right {
    float: right;
  }

  #pieChart {
    .echarts {
      height: 250px;
      width: 210px;
    }
    #detail {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  #pieChart-detail {
    margin-top: 20px;
    width: 500px;
    height: 480px;
  }
</style>


<style scoped lang="less">
  @import url('https://fonts.googleapis.com/earlyaccess/notosanskr.css');
  #status {
    .title {
      font-size: 20px;
    }
    .content {
      margin-top: 10px;
      font-size: 14px;
      span {
        margin-right: 10px;
      }
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
  .sidebar {
    background: white;
    border: 2px solid #bcbcbc;
  }
  .sidebar-header {
    float: right;
    margin: 10px;
    margin-top: 17px;
  }
  .sidebar-content {
    font-family: 'Noto Sans KR', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    margin: 10px;
  }
  .sidebar-content-margin {
    margin-top: 10px;
  }
  .admin-info {
    margin: 5px 0;
    &-content {
      font-size: 16px;
      padding: 10px;
    }
  }
  .sidebar-margin {
    margin: 10px;
  }
  .mr-0 {
    margin-right: 10px;
  }
  .ml-auto {
    margin-left:auto;
  }
  .d-block {
    display:block;
  }
  #share-btn {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
  }
</style>