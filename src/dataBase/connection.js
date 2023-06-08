import { config } from 'dotenv'
import { connect } from 'mongoose'
config()

connect(process.env.NODE_DB_HOST_EJSON_STORE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Successful database connection')
  })
  .catch((e) => {
    console.error('Database connection failed', e)
  })