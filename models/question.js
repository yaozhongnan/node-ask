import mongoose from 'mongoose'

const Schema = mongoose.Schema

const questionSchema = new Schema({
  question_id: {
    type: Number,
    required: true
  },
  cate_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  create_time: {
    type: String,
    required: true
  },
  watch_num: {
    type: Number,
    default: 0
  },
  answer_num: {
    type: Number,
    default: 0
  },
  state: {
    type: Number,
    // 0 - 未解决  1- 已解决
    enum: [0, 1],
    default: 0
  },
  extra_state: {
    type: Number,
    // 0 - 普通问题  1 - 精华  2 - 置顶
    enum: [0, 1, 2],
    default: 0
  }
})


const Question = mongoose.model('Question', questionSchema)

export default Question