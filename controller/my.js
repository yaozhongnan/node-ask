import BaseComponent from '../prototype/baseComponent'
import UserModel from '../models/user'
import QuesModel from '../models/question'
import config from '../config'
import AnswerModel from '../models/answer'

class My extends BaseComponent {
  constructor() {
    super()
    this.index = this.index.bind(this)
    this.getInformation = this.getInformation.bind(this)
    this.modifyInformation = this.modifyInformation.bind(this)
    this.getQuestion = this.getQuestion.bind(this)
    this.getAnswer = this.getAnswer.bind(this)
  }
  async index(req, res) {
    // 得到参数 token
    let token = req.query.token
    
    try {
      // 检验该 token 是否过期
      let flag = await this.checkToken(token)
      if (flag) {
        return res.json({
          code: -999,
          msg: '登录已过期'
        })
      } else {
        // 得到 user_id
        let user_id = await this.findIdByToken(token)
        // 查询 user 信息
        let user = await UserModel.findOne({
          user_id
        })
        return res.json({
          code: 0,
          msg: '获取我的数据成功',
          data: {
            nickname: user.nickname,
            create_time: user.create_time
          }
        })
      }
    } catch (err) {
      console.log(err);
      return res.json({
        code: -1,
        msg: '获取我的数据失败'
      })
    }

  }
  async getInformation(req, res) {
    let token = req.query.token

    try {
      // 检验 token 是否过期
      let flag = await this.checkToken(token)
      if (flag) {
        return res.json({
          code: -999,
          msg: '登录已过期'
        })
      } else {
        let user_id = await this.findIdByToken(token)
        let user = await UserModel.findOne({
          user_id
        })
        return res.json({
          code: 0,
          msg: '获取个人资料信息成功',
          data: user
        })
      }
    } catch (err) {
      console.log(err);
      return res.json({
        code: -1,
        msg: '获取个人资料信息失败'
      })
    }
  }
  async modifyInformation(req, res) {
    let body = req.body
    let token = req.headers.authorization

    try {
      // 检验 token 是否过期
      if (await this.checkToken(token)) {
        return res.json({
          code: -999,
          msg: '登录已过期'
        })
      } else {

        // 查询该用户的信息
        let user = await UserModel.findOne({
          user_id: parseInt(body.user_id)
        })

        // 声明一个用来保存修改信息的对象
        let updateUserInfor = {}

        // 判断该用户是否修改了昵称，如果修改了则判断昵称是否存在
        if (user.nickname !== body.nickname) {
          let repet = await UserModel.findOne({
            nickname: body.nickname
          })
          if (!repet) {
            updateUserInfor.nickname = body.nickname
          }
        }
        // 生成 头像 图片地址
        body.avatar.indexOf('data') === 0 ? updateUserInfor.avatar = await this.getImgUrl(body.avatar) : ''
        updateUserInfor.gender = body.gender
        updateUserInfor.birthday = body.birthday
        updateUserInfor.bio = body.bio

        // 进行信息更新
        await UserModel.updateOne({
          user_id: parseInt(body.user_id)
        }, updateUserInfor)

        return res.json({
          code: 0,
          msg: '修改成功'
        })
      }
    } catch (err) {
      console.log('修改个人信息失败' + err);
      return res.json({
        code: -1,
        msg: '修改个人信息失败'
      })
    }

  }
  async getQuestion(req, res) {
    try {
      let page = req.query.page
      let token = req.headers.authorization
      // 检验该 token 是否过期
      let flag = await this.checkToken(token)
      if (flag) {
        return res.json({
          code: -999,
          msg: '您的登陆已过期'
        })
      }
      // 获取 user_id
      let user_id = await this.findIdByToken(token)
      // 查询该 user_id 下的所以问题
      let data = await QuesModel.find({
        user_id
      })
      let cal = data.length / config.limit
      let totalPage = data.length % config.limit === 0 ? cal : Math.floor(cal) + 1
      let ret = data.slice((page - 1) * config.limit, (page - 1) * config.limit + config.limit)
      return res.json({
        code: 0,
        msg: '获取我的问题成功',
        data: {
          list: ret,
          totalPage
        }
      })
    }catch (err) {
      console.log(err);
      return res.json({
        code: -1,
        msg: '获取我的问题失败'
      })
    }
  }
  async applyBest (req, res) {
    try {
      let question_id = req.body.question_id
      await QuesModel.findOneAndUpdate({question_id}, {
        extra_state: 1
      })

      return res.json({
        code: 0,
        msg: '申请精华成功'
      })

    } catch (err) {
      return res.json({
        code: -1,
        msg: '申请精华失败'
      })
    }
  }
  async applyTop (req, res) {
    try {
      let question_id = req.body.question_id
      await QuesModel.findOneAndUpdate({question_id}, {
        extra_state: 2
      })

      return res.json({
        code: 0,
        msg: '申请置顶成功'
      })

    } catch (err) {
      return res.json({
        code: -1,
        msg: '申请置顶失败'
      })
    }


  }
  async getAnswer (req, res) {
    try {
      let token = req.headers.authorization
      let page = req.query.page
      // 检验 token 是否过期
      let flag = await this.checkToken(token)
      if (flag) {
        return res.json({
          code: -999,
          msg: '登录已经失效'
        })
      }
      // 获取 user_id
      let user_id = await this.findIdByToken(token)
      // 关联查询信息
      let list = await AnswerModel.aggregate([
        {
          $match: { user_id }
        },
        {
          $sort: {
            'answer_id': -1
          }
        },
        {
          $skip: (page -1) * config.limit
        },
        {
          $limit: config.limit
        },
        {
          $lookup: {
            from: 'questions',
            localField: 'question_id',
            foreignField: 'question_id',
            as: 'ques'
          }
        }
      ])
      // 计算总页数
      let infor = await AnswerModel.find({ user_id })
      let cal = infor.length / config.limit
      let totalPage = infor.length % config.limit === 0 ? cal : Math.floor(cal) + 1
      // 格式化 list
      list.forEach(item => {
        item.ques = item.ques[0]
      })
      // 返回数据
      return res.json({
        code: 0,
        msg: '获取我的问答成功',
        data: {
          list,
          totalPage
        }
      })

    } catch (err) {
      return res.json({
        code: -1,
        msg: '获取我的回答失败'
      })
    }
  }
}

export default new My