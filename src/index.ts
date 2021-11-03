import express from 'express'
import connect from './connect'
import {config} from 'dotenv-flow'
import loginRouter from './routers/loginRouter'
import raffleRouter from './routers/raffleRouter'
import salesRouter from './routers/salesRouter'
import usersRouter from './routers/usersRouter'
import pwnismRouter from './routers/pwnismRouter'
import auth from './authorization/auth'
import settingsRouter from './routers/settingsRouter'

config()
connect(process.env.MONGO_CONNECTION)

const app = express()
app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/users', auth.enforceRole('admin'), usersRouter)
app.use('/api/sales', auth.enforceRole('admin'), salesRouter)
app.use('/api/raffle', auth.enforceRole('admin'), raffleRouter)
app.use('/api/pwnism', auth.enforceRole('admin'), pwnismRouter)
app.use('/api/settings', auth.enforceRole('admin'), settingsRouter)
app.use('/api/', (req, res) => {
    res.send('NukeBot API')
})

app.listen(3000)