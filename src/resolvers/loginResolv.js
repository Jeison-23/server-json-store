import { v4 as uuidv4 } from 'uuid'
import CryptoJS from 'crypto-js'
import userModel from "../models/userModel.js"
import sessionModel from '../models/sessionModel.js'

export const login = async (_, { input = {} }) => {
  try {
    const { email, password } = input
    const query = {}
    const pass = CryptoJS.SHA512(password)
    if (email) query.email = email
    if (password) query.password = pass.toString()
    const user = await userModel.findOne(query)

    if (user) {
      const data = {
        _id: uuidv4().toString(),
        userId: user._id,
        roleId: user.roleId,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        typeId: user.typeId,
        image: user.image,
        phone: user.phone,
        createAt: new Date,
        email: user.email,
      }
      data.expirateDate = new Date(data.createAt.getTime() + (24 * 3600000))
      const session = new sessionModel(data)
      await session.save()

      return session._id

    } else {
      throw new Error("Usuario o contraseña incaorrecta porfavor intentalo mas tarde")
    }

  } catch (e) {
    return e
  }
}