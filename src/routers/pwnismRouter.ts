import express from 'express'
import {body} from 'express-validator'
import pwnismController from '../controllers/pwnismController'

let pwnismRouter = express.Router()

pwnismRouter.get('/', pwnismController.getPwnism)

pwnismRouter.post('/', [
        body('quote').isString()
    ],
    pwnismController.createPwnism
)
export default pwnismRouter