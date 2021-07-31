import express from 'express'
import Sale from '../types/mongoose/sale'
import {body, param, query} from 'express-validator'
import {mongoIdValidator} from '../validators/mongoId'
import pwnismController from '../controllers/pwnismController'
import moment from 'moment'

let pwnismRouter = express.Router()

pwnismRouter.get('/', pwnismController.getPwnism)

pwnismRouter.post('/', [
        body('quote').isString()
    ],
    pwnismController.createPwnism
)
export default pwnismRouter