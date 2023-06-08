import { config } from 'dotenv'
import userModel from "../models/userModel.js"
import { encrypt, decrypt } from "../utils/encrypt.js"

config()

export const user = async (_,{filter = {}}) => {
  try {
    const { _id, lastName, firstName, email, password  } =  filter
    const query = {}
    if (_id) query._id = _id
    if (lastName) query.lastName = {$regex: lastName, $options: 'i'}
    if (firstName) query.firstName = {$regex: firstName, $options: 'i'}
    if (email) query.email = {$regex: email, $options: 'i'}
    if (password) query.password = {$regex: password, $options: 'i'}

    return  await userModel.find(query)
  } catch (e) {
    console.log('error get user',e);
  }
}

export const userCreate = async (_,{input = {}}) => {
  try {
    const { firstName, lastName, email, password } = input
    const encryptedPassword = encrypt(password,process.env.NODE_KEY_DECRYPTED)

    const data = {
      firstName,
      lastName,
      email,
      password: encryptedPassword
    }

    const user = new userModel(data)
    await user.save()
    return user._id
    
  } catch (e) {
    console.log('error create user',e);
  }
}

export const userUpdate = async (_,{input = {}}) => {
  try {
    const { _id, firstName, lastName, email } = input
    const update = {$set:{}}
    if(firstName) update.$set.firstName = firstName
    if(lastName) update.$set.email = email
    if(email) update.$set.email = email

    const response = await userModel.findOneAndUpdate({_id},update,{new: true})
    return response._id

  } catch (e) {
    console.log('error create user',e);
  }
}

export const userSave = async (_, args= {}) => {
  try {
    const { _id } = args.input

    if(_id) return userUpdate(_,args)
    else return userCreate(_,args)
    
  } catch (e) {
    console.log('error create user',e);
  }
}
