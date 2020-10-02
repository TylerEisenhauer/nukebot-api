import express, {response} from 'express'
import {validationResult} from 'express-validator'
import moment from 'moment'
import Sale, {ISale} from '../types/mongoose/sale'

const listSales = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    //TODO: if this falls on monday it does not work correctly
    const date: moment.Moment = req.query.date ? moment.utc(req.query.date as string) : moment.utc()
    const weekStart = moment(date).startOf('day').day('Tuesday').toDate()
    const weekEnd = moment(weekStart).add(6, 'days').toDate()

    const sales: ISale[] = await Sale.find({date: {$gte: weekStart, $lte: weekEnd}})
    if (sales.length) {
        res.send(sales)
    } else {
        res.sendStatus(404)
    }
}

const getSaleById = async (req: express.Request, res: express.Response) => {
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

const deleteSale = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const saleId = req.params.saleId
        const deletedSale = await Sale.findOneAndDelete({_id: saleId})

        if (deletedSale) {
            res.sendStatus(204)
        } else {
            response.sendStatus(404)
        }
    } catch (e) {
        res.send('Error deleting sale').status(500)
    }
}

export default {
    listSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale
}