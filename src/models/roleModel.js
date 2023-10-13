import { Schema, model } from 'mongoose'

const collectionName = 'roles'

const roleSchema = Schema({
  _id: { type: String },
  key: { type: String, required: true, unique: true },
  rol: { type: String, required: true },
  accessKeys: { type: [String], require: true }
},{
  _id: false,
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, roleSchema)
