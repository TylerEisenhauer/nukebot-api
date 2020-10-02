import mongoose from 'mongoose'

export const mongoIdValidator = (value: string) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid sale reference')
    }
    return true
}