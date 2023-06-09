import { Schema, model } from "mongoose"
const collectionName = 'categories'

const categoryModel = Schema({
  _id: { type: String },
  key: { type: String, required: true },
  name: { type: String, required: true }
},{
  _id: false,
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, categoryModel)
