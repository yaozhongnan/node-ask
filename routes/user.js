import express from 'express'
import user from '../controller/user'

const router = express.Router()

// 登录
router.post('/login', user.login)
// 注册
router.post('/register', user.register)
// 退出登录
router.get('/exit', user.exit)
// 修改密码
router.post('/modifypassword', user.modifyPassword)

export default router