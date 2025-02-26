require('../db/mongoose')
const User = require("../models/users")
    //67ae04af119cf8a064240559
User.findByIdAndUpdate('67ae737cfc0d0ae6302c369c', { age: 1 }).then((user) => {
    console.log(user)
    return User.countDocuments({ age: 1 })

}).then((count) => {
    console.log(count)
}).catch((e) => { console.log(e) })