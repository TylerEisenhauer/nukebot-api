import express from 'express'
import {body} from 'express-validator'
import usersController from '../controllers/usersController'
import auth from '../authorization/auth'
import User from "../types/mongoose/user";

let usersRouter = express.Router()

usersRouter.post('/login', [
        body('username').isString(),
        body('password').isString()
    ],
    usersController.login
)

usersRouter.post('/create', auth.enforceRole('admin'), [
        body('username')
            .isString()
            .custom((value: string) => {
                return User.countDocuments({username: value}).then((count) => {
                    if (count !== 0) return Promise.reject('User Already Exists')
                })
            }),
        body('password').isString()
    ],
    usersController.create
)

export default usersRouter