const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Task = require("./tasks")


const userSchema = new mongoose.Schema({
    age: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(' Email is invalid ')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) { // or we could use minlength 
            if (value.length < 6) {
                throw new Error(' password is short ')
            }
            if (validator.contains(value.toLowerCase(), "password")) {
                throw new Error(`The string contains the word "password".`);
            }

        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}, { autoIndex: true })

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"

})




userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("unable to login ")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
        throw new Error("username or password is not correct try again ")
    return user
}

userSchema.methods.generateWebToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "gamed")
    user.tokens = user.tokens.concat({ token: token })
    await user.save()
    return token;

}
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject;

}


userSchema.pre('save', async function(next) {
        const user = this
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
        }
        next()
    })
    //delete the tasks belongs to user after user delete the profile
userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user = this;

    try {
        // Delete all tasks that belong to the user
        await Task.deleteMany({ owner: user._id });
        next();
    } catch (error) {
        console.error("Error deleting user tasks:", error.message); // Log the error for debugging
        next(error); // Pass the error to the next middleware
    }
});

const User = mongoose.model('User', userSchema)


module.exports = User