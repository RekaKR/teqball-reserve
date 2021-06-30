const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
const url = "mongodb://localhost:27017/"
//const url = "mongodb+srv://team_T4:teqball@codecoolteqball.oetes.mongodb.net/week_four_teamwork?retryWrites=true&w=majority"
const loginRouter = require('./routes/LoginRoutes')
const authEntityRoutes = require('./routes/AuthEntityRoutes')
const groupRoutes = require('./routes/GroupRoutes')
const eventRoutes = require('./routes/EventRoutes')

const mongoose = require('mongoose');

/*mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));*/
mongoose.connect(`${url}teqball`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


app.use(cors())
app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/users', authEntityRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/events', eventRoutes)



app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) }
)