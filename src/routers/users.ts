import express from 'express'
import {body} from 'express-validator'
import usersController from '../controllers/usersController'
import {authenticateToken} from '../authorization/auth'

let usersRouter = express.Router()

usersRouter.post('/login', [
        body('username').isString(),
        body('password').isString()
    ],
    usersController.login
)

usersRouter.post('/create', authenticateToken, [
        body('username').isString(),
        body('password').isString()
    ],
    usersController.create
)

export default usersRouter