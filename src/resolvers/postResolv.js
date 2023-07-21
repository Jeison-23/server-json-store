import { v4 as uuidv4 } from 'uuid'
import postModel from "../models/postModel.js"
import { UploadImage } from "./uploadImageResolv.js"

export const post = async (_, { filter = {} }) => {
  try {
    const { _id, title, type } = filter
    const query = {}
    if (_id) query._id = _id
    if (title) query.title = { $regex: title, $options: 'i' }
    return await postModel.find(query).sort({createAt:'desc'})

  } catch (e) {
    return e
  }
}

export const postCreate = async (_, { input = {} }) => {
  try {
    const {
      title,
      type,
      images,
      description,
      link
    } = input

    let postImages = []
    if (images.length) {
      if (typeof images[0] !== 'string') {
        for (let i = 0; i < images.length; i++) {
          const response = await UploadImage(images[i], "posts")
          postImages.push(response?.secure_url)
        }
      } else {
        postImages = images
      }
    }

    const data = {
      _id: uuidv4().toString(),
      title,
      type,
      description,
      link,
      images: postImages,
    }

    const post = new postModel(data)
    await post.save()
    
    return post._id

  } catch (e) {
    return e
  }
}

export const postUpdate = async (_, { input = {} }) => {
  try {
    const {
      _id,
      title,
      type,
      images,
      description,
      link
    } = input

    const update = { $set: {} }
    if (title) update.$set.title = title
    if (type) update.$set.type = type
    if (link) update.$set.link = link
    if (description) update.$set.description = description
    if (images) {
      let postImages = []
      if (images.length) {
        if (type(images[0]) !== 'string') {
          for (const image in images) {
            let image_to_db = await UploadImage(image,"posts")
            postImages.push(image_to_db?.secure_url)
          }

        } else {
          postImages = images
        }
      }
      update.$set.image = postImages
    }
    const response = await postModel.findOneAndUpdate({ _id }, update, { new: true })
    return response._id

  } catch (e) {
    return e
  }
}

export const postSave = (_, args = {} ) => {
  try {
    const { _id } = args.input
    if (_id) return postUpdate(_, args)
    else return postCreate(_, args)

  } catch (e) {
    return e
  }
}