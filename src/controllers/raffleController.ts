import express from 'express'
import Raffle, {IRaffle} from '../types/mongoose/raffle'
import RaffleEntry, {IRaffleEntry} from '../types/mongoose/raffleentry'
import {validationResult} from 'express-validator'
import {sample} from 'lodash'

const getCurrentRaffle = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const raffle = await Raffle.findOne({endedAt: null})
        if (raffle) {
            return res.send(raffle)
        }
        res.sendStatus(404)
    } catch (e) {
        res.send('Error retrieving raffle').status(500)
    }
}

const getRaffleById = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const raffleId: string = req.params.raffleId

    try {
        const raffle = await Raffle.findById(raffleId)
        if (raffle) {
            return res.send(raffle)
        }
        res.sendStatus(404)
    } catch (e) {
        res.send('Error retrieving raffle').status(500)
    }
}

const createRaffle = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const raffle: IRaffle = {
        ...req.body
    }

    try {
        res.send(await Raffle.create(raffle)).status(201)
    } catch (e) {
        res.send('Error creating raffle').status(500)
    }
}

const pickWinner = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const raffleId: string = req.params.raffleId
        const entries: IRaffleEntry[] = await RaffleEntry.find({raffle: raffleId})

        if (entries.length === 0) return res.sendStatus(404)

        const winner: IRaffleEntry = sample(entries)

        await Raffle.updateOne({_id: raffleId}, {winner: winner._id})
        res.send(winner)
    } catch (e) {
        res.send('Error picking winner').status(500)
    }
}

const updateRaffle = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const updatedFields = {
        ...req.body
    }

    try {
        res.send(await Raffle.findOneAndUpdate({_id: updatedFields._id}, updatedFields, {new: true}))
    } catch (e) {
        res.send('Error updating raffle').status(500)
    }
}

const getRaffleEntry = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {discordId, raffleId} = req.query as any

    try {
        const entry = await RaffleEntry.findOne({discordId: discordId, raffle: raffleId})
        if (entry) {
            return res.send(entry)
        }
        res.sendStatus(404)
    } catch (e) {
        res.send('Error updating raffle').status(500)
    }
}

const enterRaffle = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const entry = {
        ...req.body
    }

    try {
        res.send(await RaffleEntry.create(entry)).status(201)
    } catch (e) {
        res.send('Error updating raffle').status(500)
    }
}

export default {
    enterRaffle,
    getCurrentRaffle,
    getRaffleById,
    createRaffle,
    pickWinner,
    updateRaffle,
    getRaffleEntry
}