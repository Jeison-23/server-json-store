import userModel from "../models/userModel.js"
import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'
import { postSave } from "./postResolv.js"
import { UploadImage, deleteImage } from "./uploadImageResolv.js"

export const user = async (_, { filter = {} }, ctx) => {
  try {
    const { session } = ctx
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
    const image_to_db = await UploadImage(image[0])

    const data = {
      _id: uuidv4().toString(),
      roleId,
      firstName,
      lastName,
      id,
      typeId,
      image: image_to_db.secure_url,
      phone,
      email,
      password: encryptedPassword
    }

    const user = new userModel(data)
    await user.save()
    
    if (user._id) {
      const input = {
        title: '¡nuevo usuario!',
        type: 'info',
        description: `Démosle la bienvenida, a "${firstName} ${lastName}", 
        quien se convirtio en un nuevo miebro de nuestra grandiosa comunidad, 
        te damos la bienvenida de parte del equipo de JSON STORE y de la comunidad; 
        ¡¡Bienvenido😁🫶!!`,
        images: [image_to_db.secure_url]
      }

      await postSave(_,{input})
    }
    return user._id

  } catch (e) {
    return e
  }
}

export const userUpdate = async (_, { input = {} }) => {
  try {
    const { _id, firstName, lastName, phone, roleId, email, image, typeId, id } = input
    const update = { $set: {} }
    if (firstName) update.$set.firstName = firstName
    if (lastName) update.$set.lastName = lastName
    if (phone) update.$set.phone = phone
    if (email) update.$set.email = email
    if (roleId)update.$set.roleId = roleId
    if (image) {
      const image_to_db = await UploadImage(image[0])
      update.$set.image = image_to_db.secure_url
    }
    if (typeId) update.$set.typeId = typeId
    if (id) update.$set.id = id
    
    const response = await userModel.findOneAndUpdate({ _id }, update, { new: true })
    return response._id

  } catch (e) {
    return e
  }
}

export const userSave = async (_, args = {}) => {
  try {
    const { _id } = args.input

    if (_id) return userUpdate(_, args)
    else return userCreate(_, args)

  } catch (e) {
    return e
  }
}

export const userDelete = async (_, { _id }) => {
  try {
    const user =  await userModel.find({_id})

    
    await deleteImage(user[0].image)
    const response = await userModel.deleteOne({ _id })
    return response.acknowledged

  } catch (e) {
    return e
  }
}
