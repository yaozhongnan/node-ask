import mongoose from 'mongoose'

const Schema = mongoose.Schema

const idSchema = new Schema({
  user_id: Number,
  cate_id: Number,
  question_id: Number,
  answer_id: Number,
  anno_id: Number,
  token_id: Number,
  slide_id: Number,
})

const Id = mongoose.model('Id', idSchema)

Id.findOne((err, data) => {
  if (!data) {

    const newIds = new Id({
      user_id: 0,
      cate_id: 0,
      question_id: 0,
      answer_id: 0,
      anno_id: 0,
      token_id: 0,
      slide_id: 0,
    })

    newIds.save()
  }
})

export default Id