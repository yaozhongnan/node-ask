import BaseComponent from '../prototype/baseComponent'
import AnnoModel from '../models/anno'
import { parse } from 'path';

class Anno extends BaseComponent {
  constructor () {
    super()
  }
  async getList (req, res) {
    try {
      // 获取所有公告数据，按 Id 倒序排列
      let data = await AnnoModel.find().sort({
        anno_id: -1
      })

      return res.json({
        code: 0,
        msg: '获取公告列表成功',
        data
      })

    } catch (err) {
      console.log('获取公告列表失败' + err);
      return res.json({
        code: -1,
        msg: '获取公告列表失败'
      })
    }
  }
  async getDetail (req, res) {
    try {
      let { anno_id } = req.query

      let data = await AnnoModel.findOne({
        anno_id
      })

      return res.json({
        code: 0,
        msg: '获取公告详情成功',
        data
      })

    } catch (err) {
      console.log('获取公告详情失败' + err);
      return res.json({
        code: -1,
        msg: '获取公告详情失败'
      })
    }
  }
  async AddWatchNum (req, res) {
    try {
      let { anno_id } = req.body

      // 获取当前的阅读数量
      let anno = await AnnoModel.findOne({
        anno_id
      })
      let num = parseInt(anno.watch_num)
      // 更新阅读数量
      await AnnoModel.findOneAndUpdate({
        anno_id
      }, {
        watch_num: num + 1
      })

      return res.json({
        code: 0,
        msg: '增加阅读数量成功'
      })

    } catch (err) {
      console.log('增加阅读数量失败' + err);
      return res.json({
        code: -1,
        msg: '增加阅读数量失败'
      })
    }
  }
}

export default new Anno