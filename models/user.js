import mongoose from 'mongoose'
import config from '../config'

const Schema = mongoose.Schema

const userSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: `http://${config.public_host}:${config.port}/public/images/default.png`
  },
  gender: {
    type: String,
    enum: ['保密', '男', '女'],
    default: '保密'
  },
  bio: {
    type: String,
    default: ''
  },
  birthday: {
    type: String,
    default: ''
  },
  create_time: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', userSchema)

export default User
