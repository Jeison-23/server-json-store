import sessionModel from '../models/sessionModel.js'

export const session = async (_, { filter = {} }, ctx) => {
  try {
    const { _id, userId, firstName, lastName, typeId,  } = filter
    const query = {}
    if (_id) query._id = _id
    if (userId) query.userId = userId
    if (typeId) query.typeId = typeId
    if (firstName) query.firstName = { $regex: firstName, $options: 'i' }
    if (lastName) query.lastName = { $regex: lastName, $options: 'i' }

    const data = sessionModel.aggregate([])
      .match(query)
      .lookup({ //Join de Sql
        from: "roles",
        localField: "roleId",
        foreignField: "_id",
        as: "role"
      })
      .unwind({ path: '$role', preserveNullAndEmptyArrays: true })

      return await data.exec()
    
  } catch (e) {
    return e
  }
}
