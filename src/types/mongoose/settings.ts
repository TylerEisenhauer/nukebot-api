import mongoose, {Schema, Document} from 'mongoose'

export interface ISettings extends Document{
    alertChannelId: string
    emojiId: string
    gamaId: string
    guildId: string
    meId: string
    performGamaAlert: boolean
    pwnId: string
    wtfId: string
}

const SettingsSchema: Schema = new Schema({
    alertChannelId: {type: String, required: true},
    emojiId: {type: String, required: true},
    gamaId: {type: String, required: true},
    guildId: {type: String, required: true},
    meId: {type: String, required: true},
    performGamaAlert: {type: Boolean, required: true},
    pwnId: {type: String, required: true},
    wtfId: {type: String, required: true}
})

export default mongoose.model<ISettings>('Settings', SettingsSchema)

