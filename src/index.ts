import express from 'express'
import connect from './connect'
import {config} from 'dotenv-flow'
import salesRouter from './routers/sales'

config()
connect(process.env.MONGO_CONNECTION)
const app = express()

app.get('/', ((req, res) => {
    res.send('Hello World!')
}))

app.use('/sales', salesRouter)

app.listen(3000)