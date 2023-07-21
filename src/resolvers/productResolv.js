import productModel from '../models/productModel.js'
import { v4 as uuidv4 } from 'uuid'

export const product = async (_, { filter = {} }) => {
  try {
    const { _id, name, categoryId, price } = filter
    const query = {}
    if (_id) query._id = _id
    if (name) query.name = { $regex: name, $options: 'i' }
    if (categoryId) query.categoryId = categoryId
    if (price) query.price = price

    const data = productModel.aggregate([])
      .match(query)
      .lookup({ //Join de Sql
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      })
      .unwind({ path: '$category', preserveNullAndEmptyArrays: true })

    return await data.exec()

  } catch (e) {
    return e
  }
}

export const productCreate = async (_, { input = {}}) => {
  try {
    const { name, images, description, categoryId, price, stock } = input
    const productImages = []

    if (images.length) {
      for (let i = 0; i < images.length; i++) {
        const response = await UploadImage(images[i], "products")
        productImages.push(response?.secure_url)
      }
    }

    const dataInsert = {
      _id: uuidv4().toString(),
      name,
      images: productImages,
      description,
      categoryId,
      price,
      stock
    }
    const product = new productModel(dataInsert)
    await product.save()
    return product._id

  } catch (e) {
    return e
  }
}

export const productUpdate = async (_, { input = {}}) => {
  try {
    const { _id, name, description, categoryId, price, stock } = input
    const update = { $set: {} }
    if(name) update.$set.name = name
    if(description) update.$set.description = description
    if(categoryId) update.$set.categoryId = categoryId
    if(price) update.$set.price = price
    if(stock) update.$set.stock = stock

    const rs = await productModel.findOneAndUpdate({ _id }, update, { new: true })

    return rs._id

  } catch (e) {
    return e
  }
}

export const productSave = (_, args = {}) => {
  try {
    const { _id } = args.input
    if (_id) return productUpdate(_, args)
    else return productCreate(_, args)

  } catch (e) {
    console.log('error save product', e);
  }
}

export const productDelete = async (_,{ ids }) => {
  try {
    const response = await productModel.deleteMany( {_id:{ $in: ids }})
    return response.acknowledged
    
  } catch (e) {
    return e
  }
}
