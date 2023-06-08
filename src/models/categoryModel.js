import { Schema, model } from "mongoose"
const collectionName = 'categories'

const categoryModel = Schema({
  key: { type: String, required: true },
  name: { type: String, required: true }
},{
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, categoryModel)
