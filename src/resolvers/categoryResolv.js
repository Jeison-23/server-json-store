import { v4 as uuidv4 } from 'uuid';
import categoryModel from "../models/categoryModel.js";

export const category = async (_, { filter = {} }) => {
  try {
    const { _id, key, name } = filter
    const query = {}
    if (_id) query._id = _id
    if (key) query.key = key
    if (name) query.name = name

    return await categoryModel.find(query)

  } catch (e) {
    console.log('error category',e);
  }
}

export const categoryCreate = async (_, { input }) => {
  try {
    const { key, name } = input
    const data = {
      _id: uuidv4().toString(),
      key,
      name
    }
    const category = await categoryModel(data)
    category.save()
    return category._id

  } catch (e) {
    console.log('error create category',e);
  }
}

export const categoryUpdate = async (_,{ input }) => {
  try {
    const { _id, key, name } = input
    const update = { $set: {} }

    if (key) update.$set.key = key
    if (name) update.$set.name = name
    
    const response = await categoryModel.findOneAndUpdate({_id},update,{new: true})
    return response._id
    
  } catch (e) {
    console.log('error update category',e);
  }
}

export const categorySave = async (_, args) => {
  try {
    const { _id } = args.input
    if (_id) return categoryUpdate(_, args)

    else return categoryCreate(_, args)

  } catch (e) {
    console.log('error save category', e);
  }
}