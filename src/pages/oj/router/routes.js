// all routes here.
import {
  About,
  ACMRank,
  Announcements,
  ApplyResetPassword,
  FAQ,
  Home,
  Logout,
  NotFound,
  OIRank,
  Problem,
  ProblemList,
  ResetPassword,
  SubmissionDetails,
  SubmissionList,
  UserHome
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
    name: 'lecture-contest-details',
    path: '/CourseList/:lectureID/:contestID/',
    component: Lecture.LectureContestDetails,
    meta: {title: 'Contest Details'},
    children: [
      {
        name: 'lecture-contest-submission-list',
        path: 'submissions',
        component: SubmissionList
      },
      {
        name: 'lecture-contest-problem-list',
        path: 'problems',
        component: Lecture.LectureContestProblemList
      },
      {
        name: 'lecture-contest-problem-details',
        path: 'problem/:problemID/',
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
    path: '*',
    meta: {title: '404'},
    component: NotFound
  }
]
