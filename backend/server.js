const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
const url = "mongodb://localhost:27017/"
const loginRouter = require('./routes/LoginRoutes')
const authEntityRoutes = require('./routes/AuthEntityRoutes')
const groupRoutes = require('./routes/GroupRoutes')



const mongoose = require('mongoose');
mongoose.connect(`${url}teqball`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


app.use(cors())
app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/users', authEntityRoutes)
app.use('/api/groups', groupRoutes)



app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) }
)