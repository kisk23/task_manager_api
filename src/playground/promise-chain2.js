require('../db/mongoose')
const Task = require("../models/tasks")

// Task.findByIdAndDelete('67ae77568e1c75f5b36aa6e9').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ complete: false })

// }).then((count) => {
//     console.log(count)
// }).catch((e) => { console.log(e) })



const FindTheUserDeleteAndCount = async(id, complete) => {
    await Task.findByIdAndDelete(id)
    return Task.countDocuments({ complete })

}

FindTheUserDeleteAndCount('67ae04af119cf8a064240559', false).then((count) => {
    console.log(count)
}).catch((e) => { console.log(e) })