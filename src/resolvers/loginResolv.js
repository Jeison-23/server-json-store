import { v4 as uuidv4 } from 'uuid'
import userModel from "../models/userModel.js"
import sessionModel from '../models/sessionModel.js'

export const login = async (_, { input = {} }) => {
  try {
    const { email, password } = input
    const query = {}
    if (email) query.email = email
    if (password) query.password = password

    const user = await userModel.find(query)

    if (user.length) {
      const userObject = user[0]
      const data = {
        _id: uuidv4().toString(),
        userId: userObject._id,
        roleId: userObject.roleId,
        firstName: userObject.firstName,
        lastName: userObject.lastName,
        id: userObject.id,
        typeId: userObject.typeId,
        image: userObject.image,
        phone: userObject.phone,
        createAt: new Date,
        email: userObject.email,
      }
      data.expirateDate = new Date(data.createAt.getTime() + (30 * 1000))

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