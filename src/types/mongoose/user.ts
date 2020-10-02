import mongoose, {Schema, Document, HookNextFunction} from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document{
    username: string
    password: string
}

const UserSchema: Schema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
})

UserSchema.pre<IUser>('save', async function(next: HookNextFunction) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

export default mongoose.model<IUser>('User', UserSchema)

