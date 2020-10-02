import express from 'express'
import User from '../types/mongoose/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const login = async (req: express.Request, res: express.Response) => {
    const user = await User.findOne({username: req.body.username})

    if (await bcrypt.compare(req.body.password, user.password)) {
        return res.send({
            'access_token': jwt.sign(user.username, process.env.JWT_SECRET)
        })
    }

    res.sendStatus(401)
}

const create = async (req: express.Request, res: express.Response) => {
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