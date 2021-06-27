const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
const url = "mongodb://localhost:27017/"
const loginRouter = require('./routes/LoginRoutes')
const authEntityRoutes = require('./routes/AuthEntityRoutes')



const mongoose = require('mongoose');
mongoose.connect(`${url}teqball`, {useNewUrlParser: true, useUnifiedTopology: true});


app.use(cors())
app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/users', authEntityRoutes)



app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) }
)