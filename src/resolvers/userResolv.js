import userModel from "../models/userModel.js"
import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'

export const user = async (_, { filter = {} }) => {
  try {
    const { _id, lastName, firstName, email, password } = filter
    const query = {}
    if (_id) query._id = _id
    if (lastName) query.lastName = { $regex: lastName, $options: 'i' }
    if (firstName) query.firstName = { $regex: firstName, $options: 'i' }
    if (email) query.email = { $regex: email, $options: 'i' }
    if (password) query.password = { $regex: password, $options: 'i' }

    const data = userModel.aggregate([])
      .match(query)
      .lookup({
        from: "roles",
        localField: "roleId",
        foreignField: "_id",
        as: "role"
      })
      .unwind({ path: '$role', preserveNullAndEmptyArrays: true })
    return await data.exec()

  } catch (e) {
    console.log('error get user', e);
  }
}

export const userCreate = async (_, { input = {} }) => {
  try {
    const {
      firstName,
      password,
      lastName,
      roleId,
      typeId,
      image,
      phone,
      email,
      id
    } = input

    const encryptedPassword = CryptoJS.SHA512(password)
    const data = {
      _id: uuidv4().toString(),
      roleId,
      firstName,
      lastName,
      id,
      typeId,
      image,
      phone,
      email,
      password: encryptedPassword
    }

    const user = new userModel(data)
    await user.save()
    return user._id

  } catch (e) {
    console.log('error create user', e);
  }
}

export const userUpdate = async (_, { input = {} }) => {
  try {
    const { _id, firstName, lastName, phone, email } = input
    const update = { $set: {} }
    if (firstName) update.$set.firstName = firstName
    if (lastName) update.$set.lastName = lastName
    if (phone) update.$set.phone = phone
    if (email) update.$set.email = email

    const response = await userModel.findOneAndUpdate({ _id }, update, { new: true })
    return response._id

  } catch (e) {
    console.log('error create user', e);
  }
}

export const userSave = async (_, args = {}) => {
  try {
    const { _id } = args.input

    if (_id) return userUpdate(_, args)
    else return userCreate(_, args)

  } catch (e) {
    console.log('error create user', e);
  }
}

export const userDelete = async (_, { _id }) => {
  try {
    const response = await userModel.deleteOne({ _id })
    return response.acknowledged

  } catch (e) {
    console.log('error delete user', e);
  }
}
