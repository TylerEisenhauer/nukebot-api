import express from 'express'
import Sale from '../types/mongoose/sale'
import {body, param, query} from 'express-validator'
import {mongoIdValidator} from '../validators/mongoId'
import salesController from '../controllers/salesController'
import auth from '../authorization/auth'
import moment from 'moment'

let salesRouter = express.Router()

salesRouter.get('/',
    query('date').optional().custom((value) => {
        const date = moment.utc(value)
        return date.isValid()
    }),
    salesController.listSales
)

salesRouter.get('/:saleId',
    param('saleId').custom(value => {
        return mongoIdValidator(value)
    }),
    salesController.getSaleById
)

salesRouter.post('/', auth.enforceRole('admin'), [
        body('buyerName').isString(),
        body('buyerBattleTag').isString(),
        body('service').isString(),
        body('date').custom((value) => {
            const date = moment.utc(value)
            return date.isValid()
        }),
        body('price').isNumeric(),
        body('amountCollected').isNumeric()
    ],
    salesController.createSale
)

salesRouter.patch('/:saleId', auth.enforceRole('admin'), [
        param('saleId')
            .custom(value => {
                return mongoIdValidator(value)
            })
            .custom(value => {
                return Sale.countDocuments({_id: value}).then((count) => {
                    if (count === 0) return Promise.reject('Invalid sale reference')
                })
            }),
        body('buyerName').optional().isString(),
        body('buyerBattleTag').optional().isString(),
        body('service').optional().isString(),
        body('date').optional().custom((value) => {
            const date = moment.utc(value)
            return date.isValid()
        }),
        body('price').optional().isNumeric(),
        body('amountCollected').optional().isNumeric()
    ],
    salesController.updateSale
)

salesRouter.delete('/:saleId', auth.enforceRole('admin'), [
        param('saleId')
            .custom(value => {
                return mongoIdValidator(value)
            })
            .custom(value => {
                return Sale.countDocuments({_id: value}).then((count) => {
                    if (count === 0) return Promise.reject('Invalid sale reference')
                })
            })
    ],
    salesController.deleteSale
)

export default salesRouter