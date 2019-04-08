import express from 'express'
import home from '../controller/home'

const router = express.Router()

// 获取首页数据 接口
router.get('/', home.getHomeData)

export default router