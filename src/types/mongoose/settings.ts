import mongoose, {Schema, Document} from 'mongoose'

export interface ISettings extends Document{
    alertChannelId: number
    emojiId: number
    gamaId: number
    guildId: number
    meId: number
    performGamaAlert: boolean
    pwnId: number
    wtfId: number
}

const SettingsSchema: Schema = new Schema({
    alertChannelId: {type: Number, required: true},
    emojiId: {type: Number, required: true},
    gamaId: {type: Number, required: true},
    guildId: {type: Number, required: true},
    meId: {type: Number, required: true},
    performGamaAlert: {type: Boolean, required: true},
    pwnId: {type: Number, required: true},
    wtfId: {type: Number, required: true}
})

export default mongoose.model<ISettings>('Settings', SettingsSchema)

