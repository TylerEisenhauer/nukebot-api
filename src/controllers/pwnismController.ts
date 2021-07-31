import express from 'express'
import Pwnism, {IPwnism} from '../types/mongoose/pwnism'
import {validationResult} from "express-validator";

const getPwnism = async (req: express.Request, res: express.Response) => {
    const numberOfDocuments = await Pwnism.countDocuments()
    const skip = Math.floor(Math.random() * numberOfDocuments)

    const pwnism = await Pwnism.findOne().skip(skip)

    return res.send(pwnism)
}

const createPwnism = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const pwnism: IPwnism = {
        ...req.body
    }

    const isDuplicate: boolean = await Pwnism.countDocuments({quote: pwnism.quote}) !== 0
    if (isDuplicate) return res.send('Pwnism already exists').status(409)

    try {
        res.send(await Pwnism.create(pwnism)).status(201)
    } catch (e) {
        res.send('Error creating pwnism').status(500)
    }
}

export default {
    getPwnism,
    createPwnism
}