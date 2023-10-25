import { Schema, model } from "mongoose"
const collectionName = 'sales'

const saleSchema = Schema({
  _id: {type: String},
  customerName: { type: String, required: true },
  customerId: { type: String, required: true },
  address: { type: String, required: true},
  phone: { type: String, required: true },
  reciverName: { type: String },
  cardNumber: { type: String, required: true },
  cvv: { type: String, required: true },
  purchasedItems: {type: [Object], required: true},
  createAt: {type: Date, default: Date.now},
},{
  _id: false,
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, saleSchema)