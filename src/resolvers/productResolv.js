import productModel from '../models/productModel.js'

export const product = async (_, { filter = {}}) => {
  try {
    const { _id, name, categoryId, price } =  filter
    const query = {}
    if (_id) query._id = _id
    if (name) query.name = {$regex: name, $options: 'i'}
    if (categoryId) query.categoryId = categoryId
    if (price) query.price = price

    return await productModel.find(query)

  } catch (e) {
    console.log('error get product',e);
  }

}

export const productCreate = async (_, { input = {}}) => {
  try {
    const { name, description, categoryId, price, stock } = input
    const dataInsert = {
      name,
      description,
      categoryId,
      price,
      stock
    }
    const product = new productModel(dataInsert)
    await product.save()
    return product._id

  } catch (e) {
    console.log('error create product', e);
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
    console.log('error update product', e);
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
    console.log('error delete product',e);
  }

}
