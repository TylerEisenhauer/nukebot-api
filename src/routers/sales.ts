import express from 'express'
import Sale from '../types/mongoose/sale'
import {body, param, query} from 'express-validator'
import {mongoIdValidator} from '../validators/mongoId'
import salesController from '../controllers/salesController'

let salesRouter = express.Router()

salesRouter.get('/',
    query('date').optional().isDate(),
    salesController.listSales
)

salesRouter.get('/:saleId',
    param('saleId').custom(value => {
        return mongoIdValidator(value)
    }),
    salesController.getSalesById
)

salesRouter.post('/', [
        body('buyerName').isString(),
        body('buyerBattleTag').isString(),
        body('service').isString(),
        body('date').isDate(),
        body('price').isNumeric(),
        body('amountCollected').isNumeric()
    ],
    salesController.createSale
)

salesRouter.patch('/:saleId', [
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
        body('date').optional().isDate(),
        body('price').optional().isNumeric(),
        body('amountCollected').optional().isNumeric()
    ],
    salesController.updateSale
)

export default salesRouter