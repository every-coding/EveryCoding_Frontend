// all routes here.
import {
  About,
  ACMRank,
  Announcements,
  ApplyResetPassword,
  FAQ,
  Home,
  Login_,
  Logout,
  NotFound,
  OIRank,
  POINTRank,
  Problem,
  ProblemQnA,
  ProblemList,
  ResetPassword,
  SubmissionDetails,
  SubmissionList,
  UserHome,
  ProblemQnADetail,
  LectureContestExit,
  ide,
  StudyForGroup
} from '../views'

import * as Contest from '@oj/views/contest'

import * as Setting from '@oj/views/setting'

import * as Lecture from '@oj/views/lecture'

export default [
  {
    name: 'home',
    path: '/',
    meta: {title: 'Home'},
    component: Home
  },
  {
    name: 'logout',
    path: '/logout',
    meta: {title: 'Logout'},
    component: Logout
  },
  {
    name: 'problem-qna-list',
    path: '/question',
    meta: {requiresAuth: true, title: 'questions'},
    component: ProblemQnA
  },
  {
    name: 'problem-qna-detail',
    path: '/question/:questionID',
    meta: {requiresAuth: true, title: 'questions'},
    component: ProblemQnADetail
  },
  { // group study
    name: 'problem-qna-list',
    path: '/groupstudy',
    meta: {requiresAuth: true, title: 'group study'},
    component: StudyForGroup
  },
  {
    name: 'login',
    path: '/login',
    meta: {title: 'Login_'},
    component: Login_
  },
  {
    name: 'apply-reset-password',
    path: '/apply-reset-password',
    meta: {title: 'Apply Reset Password'},
    component: ApplyResetPassword
  },
  {
    name: 'reset-password',
    path: '/reset-password/:token',
    meta: {title: 'Reset Password'},
    component: ResetPassword
  },
  {
    name: 'problem-list',
    path: '/problem',
    meta: {title: 'Problem List'},
    component: ProblemList
  },
  {
    name: 'problem-details',
    path: '/problem/:problemID',
    meta: {title: 'Problem Details'},
    component: Problem
  },
  {
    name: 'submission-list',
    path: '/status',
    meta: {title: 'Submission List'},
    component: SubmissionList
  },
  {
    name: 'submission-details',
    path: '/status/:id/',
    meta: {title: 'Submission Details'},
    component: SubmissionDetails
  }, // contest를 포괄하는 lecture 시작
  {
    name: 'course-list',
    path: '/CourseList',
    meta: {title: 'Course List'},
    component: Lecture.CourseList
  },
  {
    name: 'lecture-list',
    path: '/lecture',
    meta: {title: 'Lecture List'},
    component: Lecture.LectureList
  },
  {
    name: 'lecture-details',
    path: '/CourseList/:lectureID/',
    component: Lecture.LectureDetails,
    meta: {title: 'Lecture Details'}
  },
  {
    name: 'lecture-submission-detail',
    path: '/CourseList/:lectureID/submissions',
    component: Lecture.LectureSubmissionDetails,
    meta: {title: 'Lecture Details'}
  },
  {
    name: 'constest-problem-qna',
    path: '/CourseList/:lectureID/:contestID/question',
    meta: {title: 'Problem QnA'},
    props: true,
    component: ProblemQnA
  },
  {
    name: 'constest-problem-public-qna',
    path: '/CourseList/:lectureID/:contestID/question/public',
    meta: {title: 'Public Problem QnA'},
    props: true,
    component: ProblemQnA
  },
  {
    name: 'constest-problem-qna-detail',
    path: '/CourseList/:lectureID/:contestID/question/:questionID',
    meta: {title: 'Problem QnA Detail'},

    component: ProblemQnADetail
  },
  {
    name: 'lecture-contest-details',
    path: '/CourseList/:lectureID/:contestID/',
    component: Lecture.LectureContestDetails,
    props: true,
    meta: {title: 'Contest Details'},
    children: [
      {
        name: 'lecture-contest-submission-list',
        path: 'submissions',
        component: SubmissionList
      },
      {
        name: 'lecture-contest-exit',
        path: 'exit',
        component: LectureContestExit // working by soojung
      },
      {
        name: 'lecture-contest-problem-list',
        path: 'problems',
        component: Lecture.LectureContestProblemList
      },
      {
        name: 'lecture-contest-problem-details',
        path: 'problem/:problemID/',
        props: true,
        component: Problem
      },
      {
        name: 'lecture-contest-announcement-list',
        path: 'announcements',
        component: Announcements
      },
      {
        name: 'lecture-contest-rank',
        path: 'rank',
        component: Lecture.LectureContestRank
      },
      {
        name: 'lecture-acm-helper',
        path: 'helper',
        component: Lecture.LectureACMContestHelper
      }
    ]
  }, // lecture 끝
  {
    name: 'contest-list',
    path: '/contest',
    meta: {title: 'Contest List'},
    component: Contest.ContestList
  },
  {
    name: 'contest-details',
    path: '/contest/:contestID/',
    component: Contest.ContestDetails,
    meta: {title: 'Contest Details'},
    children: [
      {
        name: 'contest-submission-list',
        path: 'submissions',
        component: SubmissionList
      },
      {
        name: 'contest-problem-list',
        path: 'problems',
        component: Contest.ContestProblemList
      },
      {
        name: 'contest-problem-details',
        path: 'problem/:problemID/',
        component: Problem
      },
      {
        name: 'contest-announcement-list',
        path: 'announcements',
        component: Announcements
      },
      {
        name: 'contest-rank',
        path: 'rank',
        component: Contest.ContestRank
      },
      {
        name: 'acm-helper',
        path: 'helper',
        component: Contest.ACMContestHelper
      }
    ]
  },
  {
    name: 'acm-rank',
    path: '/acm-rank',
    meta: {title: 'ACM Rankings'},
    component: ACMRank
  },
  {
    name: 'oi-rank',
    path: '/oi-rank',
    meta: {title: 'OI Rankings'},
    component: OIRank
  },
  {
    name: 'point-rank',
    path: '/point-rank',
    meta: {title: 'POINT Rankings'},
    component: POINTRank
  },
  {
    name: 'user-home',
    path: '/user-home',
    component: UserHome,
    meta: {requiresAuth: true, title: 'User Home'}
  },
  {
    path: '/setting',
    component: Setting.Settings,
    children: [
      {
        name: 'default-setting',
        path: '',
        meta: {requiresAuth: true, title: 'Default Settings'},
        component: Setting.ProfileSetting
      },
      {
        name: 'profile-setting',
        path: 'profile',
        meta: {requiresAuth: true, title: 'Profile Settings'},
        component: Setting.ProfileSetting
      },
      {
        name: 'account-setting',
        path: 'account',
        meta: {requiresAuth: true, title: 'Account Settings'},
        component: Setting.AccountSetting
      },
      {
        name: 'security-setting',
        path: 'security',
        meta: {requiresAuth: true, title: 'Security Settings'},
        component: Setting.SecuritySetting
      },
      {
        name: 'test-setting',
        path: 'test',
        meta: {requiresAuth: true, title: 'Test Settings'},
        component: Setting.TestSetting
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    meta: {title: 'About'},
    component: About
  },
  {
    path: '/faq',
    name: 'faq',
    meta: {title: 'FAQ'},
    component: FAQ
  },
  {
    path: '/ide',
    name: 'ide',
    meta: {title: 'ide'},
    component: ide
  },
  {
    path: '*',
    redirect: '404'
  },
  {
    path: '/404',
    meta: {title: '404'},
    component: NotFound
  }
]
