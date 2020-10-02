import express from 'express'
import User from '../types/mongoose/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {validationResult} from "express-validator";

const login = async (req: express.Request, res: express.Response) => {
    const user = await User.findOne({username: req.body.username})

    if (await bcrypt.compare(req.body.password, user.password)) {
        return res.send({
            'access_token': jwt.sign({
                user: user.username,
                roles: user.roles
            }, process.env.JWT_SECRET)
        })
    }

    res.sendStatus(401)
}

const create = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const user = {
        ...req.body
    }

    await User.create(user)

    res.sendStatus(201)
}

export default {
    login,
    create
}