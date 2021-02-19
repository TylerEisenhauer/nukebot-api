import express from 'express'
import connect from './connect'
import {config} from 'dotenv-flow'
import salesRouter from './routers/salesRouter'
import usersRouter from './routers/usersRouter'
import raffleRouter from './routers/raffleRouter'
import auth from './authorization/auth'

config()
connect(process.env.MONGO_CONNECTION)

const app = express()
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/sales', auth.enforceRole('admin'), salesRouter)
app.use('/api/raffle', auth.enforceRole('admin'), raffleRouter)
app.use('/api/', (req, res) => {
    res.send('NukeBot API')
})

app.listen(3000)