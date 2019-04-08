import Ids from '../models/ids'
import TokenModel from '../models/token'
import jwt from 'jsonwebtoken'
import config from '../config'
import fs from 'fs'
import path from 'path'

export default class baseComponent {
  constructor() {
    this.idList = ['user_id', 'cate_id', 'question_id', 'answer_id', 'anno_id', 'token_id', 'slide_id']
  }
  // 生成 token 并插入 token 表中
  async getTokenAndSave(user_id, user) {
    user = user || {}
    // 判断传入的 user_id 是否存在
    let tokenData = await TokenModel.findOne({
      user_id
    })
    // 如果该 user_id 下存在 token ，直接返回该 token，不重新生成
    if (tokenData) {
      return tokenData.token
    }
    // 生成 token
    // jwt.sign - 参数1 - 要生成的 token 的主题信息，一个对象格式的数据
    // jwt.sign - 参数2 - 加密的key（密钥） 
    // jwt.sign - 参数3 - 设置过期时间
    let token = jwt.sign(user, config.secret, {
      expiresIn: config.overdue_time
    })

    try {
      // 创建一条 token 信息
      let newToken = {
        token_id: await this.getId('token_id'),
        user_id,
        token,
        noformat_time: Date.now(),
        create_time: this.getCreateTime()
      }
      // 存入 token 表中
      await TokenModel.create(newToken)

    } catch (err) {
      console.log('token 生成错误')
    }

    // 返回该 token    
    return token
  }
  // 校验 token 是否过期
  async checkToken(token) {
    // 根据 token 查询 token 表中信息
    let tokenData = await TokenModel.findOne({
      token
    })
    // 如果查到信息，进行过期验证
    if (tokenData) {
      let surplusTime = Date.now() - tokenData.noformat_time

      if (surplusTime >= config.overdue_time) {
        // 过期
        // 删除该条 token 信息
        await TokenModel.deleteOne({
          token
        })
        return true
      } else {
        // 没过期
        return false
      }
    }
    // 如果查不到 直接判断过期
    return true

  }
  // 根据 token 查找 user_id
  async findIdByToken(token) {
    if (!token) return
    try {
      let tokenData = await TokenModel.findOne({
        token
      })
      return tokenData.user_id
    } catch (err) {
      console.log('查找 id 失败' + err);
    }
  }
  // 生成 id
  async getId(type) {
    if (!this.idList.includes(type)) {
      console.log('id类型错误');
      throw new Error('id类型错误');
      return
    }
    try {
      const idData = await Ids.findOne()
      idData[type]++
      await idData.save()
      return idData[type]
    } catch (err) {
      console.log('获取 id 数据失败')
      throw new Error(err)
    }
  }
  // 生成创建时间
  getCreateTime(format = 'YY-MM-DD hh:mm:ss') {

    let date = new Date();

    let year = date.getFullYear(),
      month = date.getMonth() + 1, //月份是从0开始的
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
    let preArr = Array.apply(null, Array(10)).map(function (elem, index) {
      return '0' + index;
    }); ////开个长度为10的数组 格式为 00 01 02 03

    let newTime = format.replace(/YY/g, year)
      .replace(/MM/g, preArr[month] || month)
      .replace(/DD/g, preArr[day] || day)
      .replace(/hh/g, preArr[hour] || hour)
      .replace(/mm/g, preArr[min] || min)
      .replace(/ss/g, preArr[sec] || sec);

    return newTime;
  }
  // 根据 base64 生成图片并返回一个图片地址
  async getImgUrl(base) {
    let name = Date.now() + '.png'
    // 设置图片的生成路径
    // let ps = '../wd-app-server/public/images/' + name
    let ps = path.join(__dirname, `../public/images/${name}`)
    //去掉图片base64码前面部分data:image/png;base64
    base = base.replace(/^data:image\/\w+;base64,/, "");
    //把base64码转成buffer对象，
    let dataBuffer = new Buffer(base, 'base64');
    // 用fs写入文件
    await this.write(ps, dataBuffer)
    return `http://${config.public_host}:${config.port}/public/images/${name}`
  }
  // 文件写入
  write(ps, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(ps, data, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}