import mongoose from 'mongoose'

const Schema = mongoose.Schema

const tokenSchema = new Schema({
  token_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  noformat_time: {
    type: Number,
    required: true
  },
  create_time: {
    type: String,
    required: true
  }
})

const token = mongoose.model('Token', tokenSchema)

export default token
