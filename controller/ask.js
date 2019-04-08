import BaseComponent from '../prototype/baseComponent'
import CategoryModel from '../models/category'
import QuesModel from '../models/question'
import AnswerModel from '../models/answer'
import UserModel from '../models/user'
import config from '../config'

class Ask extends BaseComponent {
  constructor() {
    super()
    this.category = this.category.bind(this)
    this.publish = this.publish.bind(this)
    this.resQuesByState = this.resQuesByState.bind(this)
    this.detail = this.detail.bind(this)
    this.answer = this.answer.bind(this)
    this.reply = this.reply.bind(this)
    this.getQuesByCate = this.getQuesByCate.bind(this)
  }
  async category(req, res) {
    try {
      let data = await CategoryModel.find()

      return res.json({
        code: 0,
        msg: '获取问答分类成功',
        data
      })

    } catch (err) {

      console.log('获取问答分类失败' + err);
      return res.json({
        code: -1,
        msg: '获取问答分类失败'
      })
    }

  }
  async publish(req, res) {
    let token = req.headers.authorization
    let {
      cate_id,
      title,
      description
    } = req.body

    try {

      // 检查 token 是否过期
      if (await this.checkToken(token)) {
        return res.json({
          code: -1,
          msg: '登录已过期'
        })
      } else {

        let newQues = {
          question_id: await this.getId('question_id'),
          cate_id: parseInt(cate_id),
          user_id: await this.findIdByToken(token),
          title,
          description,
          create_time: this.getCreateTime()
        }

        await QuesModel.create(newQues)

        return res.json({
          code: 0,
          msg: '发表成功',
          data: newQues
        })
      }

    } catch (err) {
      console.log('发表问题失败' + err)
      return res.json({
        code: -1,
        msg: '发表问题失败'
      })
    }
  }
  async resQuesByState(req, res) {
    try {
      let page = parseInt(req.query.page)
      let state = parseInt(req.query.state)
      let condition = {}
      // 0 代表 全部问题
      switch (state) {
        // 1 - 精华问题
        case 1:
          condition.extra_state = 1;
          break;
          // 2 - 置顶问题
        case 2:
          condition.extra_state = 2;
          break;
          // 3 - 已解决问题
        case 3:
          condition.state = 1;
          break;
          // 4 - 待解决问题
        case 4:
          condition.state = 0;
          break;
      }


      // let data = {
      //   question_id: await this.getId('question_id'),
      //   cate_id: 4,
      //   user_id: 67,
      //   title: 'python爬虫-- 抓取网页、图片、文章',
      //   create_time: this.getCreateTime(),
      //   extra_state: 2
      // }
      // await QuesModel.create(data)

      let result = await QuesModel.aggregate([
        {
          $sort: {
            'question_id': -1
          }
        },
        {
          $skip: (page - 1) * config.limit
        },
        {
          $limit: config.limit
        },
        {
          $match: condition
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: 'user_id',
            as: 'from'
          },
        }
      ])

      result.forEach(item => {
        item.from = item.from[0]
      })

      return res.json({
        code: 0,
        msg: 'ok',
        data: result
      })

    } catch (err) {
      console.log('获取问题列表失败' + err);
      return res.json({
        code: -1,
        msg: '获取问题列表失败'
      })
    }
  }
  async detail(req, res) {
    try {
      let question_id = parseInt(req.query.question_id)

      let ret = await QuesModel.aggregate([{
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: 'user_id',
            as: 'from'
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'cate_id',
            foreignField: 'cate_id',
            as: 'cate'
          }
        },
        {
          $match: {
            question_id
          }
        }
      ])

      let answer = await AnswerModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: 'user_id',
            as: 'from'
          }
        },
        {
          $match: {
            question_id
          }
        }
      ])

      let result = ret[0]
      result.answer = answer
      result.from = result.from[0]
      result.cate = result.cate[0]

      // 获取当前 token 所对应的 user_id 返回前台进行判断
      let token = req.headers.authorization
      let nowUserId = await this.findIdByToken(token)

      result.nowUserId = nowUserId

      return res.json({
        code: 0,
        msg: '获取问题详情成功',
        data: result
      })
    } catch (err) {
      console.log('获取问题详情失败' + err)
      return res.json({
        code: -1,
        msg: '获取问题详情失败'
      })
    }


  }
  async answer(req, res) {
    try {
      let {
        question_id,
        content
      } = req.body
      let token = req.headers.authorization

      let newAnswer = {
        question_id,
        answer_id: await this.getId('answer_id'),
        user_id: await this.findIdByToken(token),
        content,
        answer_time: this.getCreateTime()
      }
      // 将该回答信息插入回答表
      await AnswerModel.create(newAnswer)

      // 同时将该问题下的回答数 +1
      let item = await QuesModel.findOne({
        question_id
      })
      let nowAnswerNum = parseInt(item.answer_num)
      await QuesModel.updateOne({
        question_id
      }, {
        answer_num: nowAnswerNum + 1
      })

      // 查询该回答者信息
      let ret = await UserModel.findOne({
        user_id: newAnswer.user_id
      })

      let result = Object.assign({}, ret, newAnswer)

      return res.json({
        code: 0,
        msg: '回答问题成功',
        data: result
      })
    } catch (err) {
      console.log('回答问题失败' + err)
      return res.json({
        code: -1,
        msg: '回答问题失败'
      })
    }


  }
  async modifyQues(req, res) {
    try {
      let {
        question_id,
        title,
        description
      } = req.body

      let ret = await QuesModel.updateOne({
        question_id
      }, {
        title,
        description
      })

      return res.json({
        code: 0,
        msg: '修改问题成功',
        data: ret
      })

    } catch (err) {
      console.log('修改问题失败' + err)
      return res.json({
        code: -1,
        msg: '修改问题失败'
      })
    }
  }
  async modifyAnswer(req, res) {
    try {
      let {
        answer_id,
        content
      } = req.body

      await AnswerModel.updateOne({
        answer_id
      }, {
        content
      })

      return res.json({
        code: 0,
        msg: '修改答案成功'
      })

    } catch (err) {
      console.log('修改答案失败' + err)
      return res.json({
        code: -1,
        msg: '修改答案失败'
      })
    }

  }
  async adopt(req, res) {
    try {
      let {
        answer_id,
        question_id
      } = req.query

      // 更改答案状态为推荐答案
      await AnswerModel.updateOne({
        answer_id
      }, {
        state: 1
      })
      // 更改问题状态为已解决状态
      await QuesModel.updateOne({
        question_id
      }, {
        state: 1
      })

      return res.json({
        code: 0,
        msg: '采纳成功'
      })

    } catch (err) {
      console.log('采纳回答失败' + err)
      return res.json({
        code: -1,
        msg: '采纳回答失败'
      })
    }
  }
  async reply(req, res) {
    try {
      let token = req.headers.authorization
      let {
        answer_id,
        reply_content
      } = req.body

      let user_id = await this.findIdByToken(token)

      await AnswerModel.updateOne({
        answer_id
      }, {
        '$push': {
          replys: {
            user_id,
            reply_content,
            reply_time: this.getCreateTime()
          }
        }
      })

      return res.json({
        code: 0,
        msg: '回复成功'
      })

    } catch (err) {
      console.log('回复失败' + err);
      return res.json({
        code: -1,
        msg: '回复失败'
      })
    }



  }
  async watchnum(req, res) {
    let {
      question_id
    } = req.body

    let item = await QuesModel.findOne({
      question_id
    })

    let nowWatchNum = item.watch_num

    await QuesModel.updateOne({
      question_id
    }, {
      watch_num: nowWatchNum + 1
    })
    return res.json()
  }
  async getQuesByCate (req, res) {
    try {
      let { cate_id, state, page } = req.query
      // 由于接受的是字符串需要转换为数字
      cate_id = parseInt(cate_id)
      state = parseInt(state)
      // 关联查询
      let list = await QuesModel.aggregate([
        {
          $match: {
            cate_id,
            state
          }
        },
        {
          $skip: config.limit * (page - 1)
        },
        {
          $limit: config.limit
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: 'user_id',
            as: 'from'
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'cate_id',
            foreignField: 'cate_id',
            as: 'cate'
          }
        }
      ])
      // 过滤 list 格式, 仅当 list 有 length 的时候过滤
      if (list.length) {
        list.forEach(item => {
          item.from = item.from[0]
          item.cate = item.cate[0]
        })
      }
      // 计算总页数
      let infor = await QuesModel.find({
        cate_id, state
      })
      let cal = infor.length / config.limit
      let totalPage = infor.length % config.limit === 0 ? cal : Math.floor(cal) + 1
      // 根据 cate_id 获取 cate_name
      let cate = await CategoryModel.findOne({ cate_id })

      return res.json({
        code: 0,
        msg: '获取问题成功',
        data: {
          list,
          totalPage,
          cate_name: cate.cate_name
        }
      })

    } catch (err) {
      console.log('获取问题列表失败' + err);
      return res.json({
        code: -1,
        msg: '获取问题列表失败'
      })
    }

  }
}

export default new Ask