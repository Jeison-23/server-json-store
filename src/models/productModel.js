import { Schema, model } from 'mongoose'
const collectionName = 'products'

const productSchema = Schema({
  _id: {type: String },
  name: { type: String, required: true },
  description: String,
  categoryId: {type: String, required: true},
  stock: {type: Number, default: 0},
  price: {type: Number, default: 0},
},{
  _id: false,
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, productSchema)