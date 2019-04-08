import mongoose from 'mongoose'

const Schema = mongoose.Schema

const answerSchema = new Schema({
    answer_id: {
        type: Number,
        required: true
    },
    question_id: {
        type: Number,
        required: true
    },
    user_id: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    state: {
        type: Number,
        // 0 - 普通问题  1 - 推荐问题
        enum: [0, 1],
        default: 0
    },
    answer_time: {
        type: String,
        required: true
    },
    replys: [{
        user_id: {
            type: Number,
            required: true
        },
        reply_content: {
            type: String,
            required: true
        },
        reply_time: {
            type: String,
            required: true
        }
    }]
})

const Answer = mongoose.model('Answer', answerSchema)

export default Answer