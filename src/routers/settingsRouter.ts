import express from 'express'
import {body, param} from 'express-validator'
import settingsController from '../controllers/settingsController'

let settingsRouter = express.Router()

settingsRouter.get('/:guildId',
    param('guildId').isNumeric(),
    settingsController.getSettings
)

settingsRouter.post('/:guildId', [
        body('alertChannelId').isNumeric(),
        body('emojiId').isNumeric(),
        body('gamaId').isNumeric(),
        param('guildId').isNumeric(),
        body('meId').isNumeric(),
        body('performGamaAlert').isBoolean(),
        body('pwnId').isNumeric(),
        body('wtfId').isNumeric()
    ],
    settingsController.createSettings
)

settingsRouter.patch('/:guildId', [
        body('alertChannelId').optional().isNumeric(),
        body('emojiId').optional().isNumeric(),
        body('gamaId').optional().isNumeric(),
        param('guildId').isNumeric(),
        body('meId').optional().isNumeric(),
        body('performGamaAlert').optional().isBoolean(),
        body('pwnId').optional().isNumeric(),
        body('wtfId').optional().isNumeric()
    ],
    settingsController.updateSettings
)

settingsRouter.delete('/:guildId', 
    param('guildId').isNumeric(),
    settingsController.deleteSettings
)

export default settingsRouter