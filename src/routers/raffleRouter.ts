import express from 'express'
import Raffle from '../types/mongoose/raffle'
import RaffleEntry from '../types/mongoose/raffleentry'
import {body, param, query} from 'express-validator'
import {mongoIdValidator} from '../validators/mongoId'
import raffleController from '../controllers/raffleController'
import moment from 'moment'

let raffleRouter = express.Router()

raffleRouter.get('/', raffleController.getCurrentRaffle)

raffleRouter.get('/entry', [
        query('discordId')
            .isString(),
        query('raffleId')
            .custom(value => {
                return mongoIdValidator(value)
            })
    ],
    raffleController.getRaffleEntry
)

raffleRouter.get('/:raffleId', [
        param('raffleId')
            .custom(value => {
                return mongoIdValidator(value)
            })
    ],
    raffleController.getRaffleById
)

raffleRouter.get('/winner/:raffleId', [
        param('raffleId')
            .custom(value => {
                return mongoIdValidator(value)
            })
            .custom(value => {
                return Raffle.countDocuments({_id: value}).then((count) => {
                    if (count === 0) return Promise.reject('Invalid raffle')
                })
            })
    ],
    raffleController.pickWinner
)

raffleRouter.post('/', [
        body('startedAt').custom((value) => {
            const date = moment.utc(value)
            return date.isValid()
        }),
        body('channel').isNumeric(),
        body('message').isString()
    ],
    raffleController.createRaffle
)

raffleRouter.post('/enter', [
        body('discordId').isNumeric(),
        body('name').isString(),
        body('proof').isString(),
        body('raffle')
            .custom(value => {
                return mongoIdValidator(value)
            })
            .custom(value => {
                return Raffle.countDocuments({_id: value}).then((count) => {
                    if (count === 0) return Promise.reject('Invalid raffle')
                })
            }),
        body('time').custom((value) => {
            const date = moment.utc(value)
            return date.isValid()
        })
    ],
    raffleController.enterRaffle
)

raffleRouter.patch('/:raffleId', [
        param('raffleId')
            .custom(value => {
                return mongoIdValidator(value)
            })
            .custom(value => {
                return Raffle.countDocuments({_id: value}).then((count) => {
                    if (count === 0) return Promise.reject('Invalid raffle')
                })
            }),
        body('startedAt')
            .optional()
            .custom((value) => {
                const date = moment.utc(value)
                return date.isValid()
            }),
        body('endedAt')
            .optional()
            .custom((value) => {
                const date = moment.utc(value)
                return date.isValid()
            }),
        body('channel')
            .optional()
            .isString(),
        body('message')
            .optional()
            .isString(),
        body('winner')
            .optional()
            .custom(value => {
                return mongoIdValidator(value)
            })
            .custom(value => {
                return RaffleEntry.countDocuments({_id: value}).then((count) => {
                    if (count === 0) return Promise.reject('Invalid raffle')
                })
            })
    ],
    raffleController.updateRaffle
)

export default raffleRouter