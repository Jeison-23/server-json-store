import { Schema, model } from 'mongoose'

const collectionName = 'session'

const roleSchema = Schema({
  _id: { type: String },
  userId: { type: String, required: true},
  id: { type: Number, required: true },
  roleId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  typeId: { type: String, required: true },
  image: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  createAt: {type: Date, default: Date.now},
  expiredDate: {type: Date, default: Date.now},
  expired: {type: Boolean, default: false}
}, {
  _id: false,
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, roleSchema)