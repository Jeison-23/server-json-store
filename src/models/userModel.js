import { Schema, model } from 'mongoose'
const collectionName = 'users'

const userSchema = Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: {type: Number, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true },
},{
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, userSchema)