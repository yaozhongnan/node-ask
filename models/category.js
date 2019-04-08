import mongoose from 'mongoose'

const Schema = mongoose.Schema

const categorySchema = new Schema({
  cate_id: {
    type: Number,
    required: true
  },
  cate_name: {
    type: String,
    required: true
  },
  create_time: {
    type: String,
    required: true
  }
})

const Category = mongoose.model('Category', categorySchema)

export default Category