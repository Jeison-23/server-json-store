import { v4 as uuidv4 } from "uuid"
import saleModel from "../models/saleModel.js"
import productModel from '../models/productModel.js'

export const sale = async (_, { filter = {} }) => {
  try {
    const { _id, customerId, createAt } = filter
    const query = {}
    if (_id) query._id = _id
    if (createAt) query.createAt = createAt
    if (customerId) query.customerId = customerId

    return await saleModel.find(query)
  } catch (e) {
    return e
  }
}

const saleCreate = async (_, { input = {} }) => {
  try {
    const { purchasedItems } = input
    const data = { ...input, _id: uuidv4().toString() }
    const sale = new saleModel(data)

    if (purchasedItems?.length) {
      const prodQuantity = {}
      const itemsId = purchasedItems.map(item => {
        prodQuantity[item._id] = item.quantity
        return item._id
      })
      const products = await productModel.find({ _id: { $in: itemsId } })

      products.map(async (p) => {
        if (p.stock > prodQuantity[p._id]) {
          const newVal = p.stock - prodQuantity[p._id]
          await productModel.findOneAndUpdate({ _id: p._id }, { $set: { stock: newVal} }, { new: true })
        }
      })
    }

    await sale.save()

    return sale._id

  } catch (e) {
    return e
  }
}

const saleUpdate = async (_, { input = {} }) => {
  try {
    const {
      _id,
      customerName,
      customerId,
      address,
      phone,
      reciverName,
      cardNumber,
      cvv,
      purchasedItems
    } = input

    const update = { $set: {} }

    if (customerName) update.$set.customerName = customerName
    if (customerId) update.$set.customerId = customerId
    if (address) update.$set.address = address
    if (phone) update.$set.phone = phone
    if (reciverName) update.$set.reciverName = reciverName
    if (cardNumber) update.$set.cardNumber = cardNumber
    if (cvv) update.$set.cvv = cvv
    if (purchasedItems) update.$set.purchasedItems = purchasedItems

    const resp = await saleModel.findOneAndUpdate({ _id }, update, { new: true })

    return resp._id ? true : false

  } catch (e) {
    return e
  }
}

export const saleSave = (_, args) => {
  try {
    const { _id } = args.input

    if (_id) return saleUpdate(_, args)
    else return saleCreate(_, args)

  } catch (e) {
    return e
  }
}