const mongoose = require('mongoose')
const validator = require('validator')


const Task = mongoose.model('Task', {
    describtion: {
        type: String,
        required: true,
        trim: true
    },
    complete: {
        type: Boolean,

        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})
module.exports = Task