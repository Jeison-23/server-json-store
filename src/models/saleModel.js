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
  totalSale: { type: Number, default: 0, required: true},
  createAt: {
    date: { type: Date, default: 0, required: true },
    year: { type: Number, default: 0, required: true},
    month: { type: Number, default: 0, required: true},
    dayMonth: { type: Number, default: 0, required: true},
    day: { type: Number, default: 0, required: true},
    hour: { type: Number, default: 0, required: true},
  }
},{
  _id: false,
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, saleSchema)