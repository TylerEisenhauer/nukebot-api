import mongoose, {Schema, Document} from 'mongoose'

export interface IPwnism extends Document{
    quote: number
}

const PwnismSchema: Schema = new Schema({
    quote: {type: String, required: true}
})

export default mongoose.model<IPwnism>('Pwnism', PwnismSchema)