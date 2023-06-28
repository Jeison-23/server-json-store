import { Schema, model } from 'mongoose'
const collectionName = 'users'

const userSchema = Schema({
  _id: { type: String },
  id: { type: Number, required: true },
  roleId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  typeId: { type: String, required: true },
  image: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  _id: false,
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, userSchema)