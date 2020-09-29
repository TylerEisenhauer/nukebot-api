import express from 'express'
import moment from 'moment'
import Sale, {ISale} from '../types/mongoose/sale'
import mongoose from 'mongoose'
import {param, query, validationResult} from 'express-validator'

let salesRouter = express.Router()

salesRouter.get('/',
    query('date').optional().isDate(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const date: moment.Moment = req.query.date ? moment.utc(req.query.date) : moment.utc()
        const weekStart = date.startOf('day').day('Tuesday').toDate()
        const weekEnd = date.startOf('day').day('Tuesday').add(6, 'days').toDate()
        const sales: ISale[] = await Sale.find({date: {$gte: weekStart, $lte: weekEnd}})
        if (sales.length) {
            res.send(sales)
        } else {
            res.sendStatus(404)
        }
    }
)

salesRouter.get('/:saleId',
    param('saleId').custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid sales reference')
        }
        return true
    }),
    async (req, res) => {
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
)

export default salesRouter