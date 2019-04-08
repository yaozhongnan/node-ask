import express from 'express'
import anno from '../controller/anno'

const router = express.Router()

// 获取公告列表 接口
router.get('/list', anno.getList)
// 获取公告详情 接口
router.get('/detail', anno.getDetail)
// 公告阅读数量 +1 接口
router.post('/addwatchnum', anno.AddWatchNum)

export default router