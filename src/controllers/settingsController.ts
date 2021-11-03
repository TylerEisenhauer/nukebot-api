import express, {response} from 'express'
import {validationResult} from 'express-validator'
import NodeCache from 'node-cache'
import Settings, {ISettings} from '../types/mongoose/settings'

const settingsCache = new NodeCache();

const getSettings = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const guildId: string = req.params.guildId
    if (settingsCache.has(guildId)) {
        return res.send(settingsCache.get(guildId))
    }

    const settings: ISettings = await Settings.findOne({ guildId })

    if (!settings) {
        return res.sendStatus(404)
    }

    settingsCache.set(guildId, settings)

    res.send(settings)
}

const createSettings = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const guildId: string = req.params.guildId
    const settings: ISettings = {
        ...req.body,
        guildId
    }

    try {
        const newSettings: ISettings = await Settings.create(settings)
        settingsCache.del(guildId)
        res.send(newSettings).status(201)
    } catch (e) {
        res.send('Error updating sale').status(500)
    }
}

const updateSettings = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const guildId: string = req.params.guildId
    const updatedFields = {
        ...req.body,
        guildId
    }

    try {
        const settings: ISettings = await Settings.findOneAndUpdate({ guildId }, updatedFields, {new: true})
        settingsCache.del(guildId)
        res.send(settings)
    } catch (e) {
        res.send('Error updating settings').status(500)
    }
}

const deleteSettings = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const guildId: string = req.params.guildId
        const deletedSettings = await Settings.findOneAndDelete({ guildId })

        if (deletedSettings) {
            settingsCache.del(guildId)
            res.sendStatus(204)
        } else {
            response.sendStatus(404)
        }
    } catch (e) {
        res.send('Error deleting sale').status(500)
    }
}

export default {
    getSettings,
    createSettings,
    updateSettings,
    deleteSettings
}