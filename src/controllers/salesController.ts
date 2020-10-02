import express from 'express'
import {validationResult} from 'express-validator'
import moment from 'moment'
import Sale, {ISale} from '../types/mongoose/sale'

const listSales = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const date: moment.Moment = req.query.date ? moment.utc(req.query.date as string) : moment.utc()
    const weekStart = date.startOf('day').day('Tuesday').toDate()
    const weekEnd = date.startOf('day').day('Tuesday').add(6, 'days').toDate()
    const sales: ISale[] = await Sale.find({date: {$gte: weekStart, $lte: weekEnd}})
    if (sales.length) {
        res.send(sales)
    } else {
        res.sendStatus(404)
    }
}

const getSalesById = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const saleId = req.params.saleId
    const sale = await Sale.findById(saleId)

    if (!sale) {
        return res.sendStatus(404)
    }
    res.send(sale)
}

const createSale = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const sale: ISale = {
        ...req.body
    }

    try {
        res.send(await Sale.create(sale)).status(201)
    } catch (e) {
        res.send('Error updating sale').status(500)
    }
}

const updateSale = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const updatedFields = {
        ...req.body
    }

    try {
        const saleId = req.params.saleId
        res.send(await Sale.findOneAndUpdate({_id: saleId}, updatedFields, {new: true}))
    } catch (e) {
        res.send('Error updating sale').status(500)
    }
}

export default {
    listSales,
    getSalesById,
    createSale,
    updateSale
}