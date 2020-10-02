import express from 'express'
import connect from './connect'
import {config} from 'dotenv-flow'
import salesRouter from './routers/sales'
import usersRouter from './routers/users'
import auth from './authorization/auth'

// create jwt secret
// console.log(require('crypto').randomBytes(64).toString('hex'))

config()
connect(process.env.MONGO_CONNECTION)

const app = express()
app.use(express.json())

app.use('/users', usersRouter)
app.use('/sales', auth.authenticateToken, salesRouter)

app.listen(3000)