import roleModel from "../models/roleModel.js"
import { v4 as uuidv4 } from 'uuid'

export const role = async (_, {filter = {}}) => {
  try {
    const { _id, key, rol, } =  filter
    const query = {}
    if (_id) query._id = _id
    if (key) query.key = {$regex: key, $options: 'i'}
    if (rol) query.rol = {$regex: rol, $options: 'i'}

    return await roleModel.find(query)
    
  } catch (e) {
    return e
  }
}

const roleCreate = async (_, {input = {}}) => {
  try {
    const { key, rol, accessKeys } = input
    const data = {
      _id: uuidv4().toString(),
      key,
      rol,
      accessKeys
    }

    const rolekeyUnique = await roleModel.find({key: key})

    if (!rolekeyUnique.length) {
      const roleCreated = new roleModel(data)
      await roleCreated.save()

      return roleCreated._id

    } else {
      throw new Error(`El key: "${key}", del role ya existe.`)
    }
    
  } catch (e) {
    return e
  }
}

const roleUpdate = async (_, {input = {}}) => {
  try {
    const { _id, rol, accessKeys } = input
    const update = {$set:{}}
    // if(key) update.$set.key = key
    if(rol) update.$set.rol = rol
    if (accessKeys)  update.$set.accessKeys = accessKeys

    const response = await roleModel.findOneAndUpdate({_id},update,{new: true})
    return response._id

  } catch (e) {
    return e
  }
}

export const roleSave = (_, args) => {
  try {
    const { _id } = args.input

    if(_id) return roleUpdate(_,args)
    else return roleCreate(_,args)
    
  } catch (e) {
    console.log('error create user',e);
  }
}

export const roleDelete = async (_,{ _id }) => {
  try {
    const response = await roleModel.deleteOne({_id})
    return response.acknowledged
    
  } catch (e) {
    console.log('error delete role',e);
  }

}
