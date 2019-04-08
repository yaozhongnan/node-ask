import mongoose from 'mongoose'

const Schema = mongoose.Schema

const slideSchema = new Schema({
  slide_id: {
    type: Number,
    required: true
  },
  href: {
    type: String
  },
  src: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  sort: {
    type: Number,
    default: 0
  },
  create_time: {
    type: String,
    required: true
  }
})

const Slide = mongoose.model('Slide', slideSchema)

export default Slide