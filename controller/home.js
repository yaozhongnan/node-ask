import BaseComponent from '../prototype/baseComponent'
import SlideModel from '../models/slide'
import AnnoModel from '../models/anno'
import UserModel from '../models/user'
import QuesModel from '../models/question'
import config from '../config'

class Home extends BaseComponent {
  constructor () {
    super()
  }
  async getHomeData (req, res) {
    try {
      // 查询轮播图数据
      let slideList = await SlideModel.find()
      // 查询最后一条公告
      let annoList = await AnnoModel.find().sort({
        anno_id: -1
      }).limit(1)
      // 查询注册总人数
      let userNum = await UserModel.count()
      // 查询问答总数量
      let quesNum = await QuesModel.count()
      // 查询累计解决问题数量
      let solveNum = await QuesModel.find({
        state: 1
      }).count()
      // 查询最新的 8条 问题
      let quesList = await QuesModel.aggregate([
        {
          $sort: {
            question_id: -1
          }
        },
        {
          $limit: config.limit
        },
        {
          $lookup:{
            from: 'users',
            localField: 'user_id',
            foreignField: 'user_id',
            as: 'from'
          }
        }
      ])
      // 过滤 quesList 格式
      if (quesList.length) {
        quesList.forEach(item => {
          item.from = item.from[0]
        })
      }

      return res.json({
        code: 0,
        msg: '获取首页数据成功',
        data: {
          slideList,
          anno: annoList[0],
          quesList,
          userNum,
          quesNum,
          solveNum
        }
      })


    } catch (err) {
      console.log('获取首页数据失败' + err);
      return res.json({
        code: -1,
        msg: '获取首页数据失败'
      })
    }
  }
}

export default new Home