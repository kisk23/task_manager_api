const express = require('express')

require("./db/mongoose")
const routerUser = require('./routers/user')
const routerTask = require('./routers/task')
const app = express()

const port = process.env.PORT || 3000


app.use(express.json())

app.use(routerUser)
app.use(routerTask)



app.listen(port, () => {
    console.log(`Example app listening on port ${ port } `)
})

const User = require("./models/users")
const Task = require("./models/tasks")

const functi = async() => {
    try {
        // Find the user by ID
        const user = await User.findById("67bf4347dde990fc60f72c4f");

        if (!user) {
            console.log("User not found");
            return;
        }

        // Populate the 'tasks' field
        await user.populate("tasks") // For Mongoose v5.x and earlier
            // await user.populate("tasks"); // For Mongoose v6.x and later

        // Log the populated tasks
        console.log(user.tasks);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

functi();