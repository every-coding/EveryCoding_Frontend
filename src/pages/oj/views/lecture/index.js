const CourseList = () => import(/* webpackChunkName: "contest" */ './CourseList.vue')
const LectureList = () => import(/* webpackChunkName: "contest" */ './LectureList.vue')
const LectureDetails = () => import(/* webpackChunkName: "contest" */ './LectureDetail.vue')

export {LectureDetails, LectureList, CourseList}
