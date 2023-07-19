import { model, Schema } from "mongoose"

const collectionName = 'posts'

const postSchema = Schema({
  _id: {type: String},
  type: {type: String, required: true},
  title: {type: String, required: true},
  images: {type: [String], default: []},
  description: {type: String, default: ''},
  link: {type: String, default: ''},
  createAt: {type: Date, default: Date.now},
  updateAt: {type: Date, default: Date.now}
},{
  _id: false,
  collection: collectionName,
  versionKey: false
})

export default model(collectionName, postSchema)