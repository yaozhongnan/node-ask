import mongoose from 'mongoose'

const Schema = mongoose.Schema

const annoSchema = new Schema({
  anno_id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'mh.'
  },
  watch_num: {
    type: Number,
    default: 0
  },
  create_time: {
    type: String,
    required: true
  }
})

const Anno = mongoose.model('Anno', annoSchema)

export default Anno