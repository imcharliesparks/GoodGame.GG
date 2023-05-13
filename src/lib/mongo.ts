// SETUP TODO: Remove unused DBs
import mongoose from 'mongoose'
import { MONGODB_URI } from '../shared/constants'

export const connectToMongoDB = async () => await mongoose.connect(MONGODB_URI)
