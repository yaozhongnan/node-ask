import express from 'express'
import my from '../controller/my'

const router = express.Router()

// 首页
router.get('/index', my.index)
// 获取个人资料
router.get('/information', my.getInformation)
// 修改个人资料
router.post('/information', my.modifyInformation)
// 获取我的问题
router.get('/question', my.getQuestion)
// 我的问题 - 申请精华
router.post('/applybest', my.applyBest)
// 我的问题 - 申请置顶
router.post('/applytop', my.applyTop)
// 获取我的回答
router.get('/answer', my.getAnswer)

export default router