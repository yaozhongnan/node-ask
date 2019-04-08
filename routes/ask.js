import express from 'express'
import ask from '../controller/ask'

const router = express.Router()

// 问答分类接口
router.get('/category', ask.category)
// 发布问题接口
router.post('/publish', ask.publish)
// 根据不同的状态返回相应问题信息
router.get('/question', ask.resQuesByState)
// 查看问题详情接口
router.get('/detail', ask.detail)
// 回答问题接口
router.post('/answer', ask.answer)
// 修改问题接口
router.post('/modify_ques', ask.modifyQues)
// 修改回答接口
router.post('/modify_answer', ask.modifyAnswer)
// 采纳答案接口
router.get('/adopt', ask.adopt)
// 回复接口
router.post('/reply', ask.reply)
// 查看数量 +1 接口
router.post('/watchnum', ask.watchnum)
// 根据问题分类获取问题 接口
router.get('/quesbycate', ask.getQuesByCate)

export default router