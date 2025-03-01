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



// const functi = async() => {
//     try {



//     } catch (error) {

//     }
// };

// functi();