const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const NewsSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    image:{
        type:Buffer
    }
  
})

const News = mongoose.model('News', NewsSchema)
module.exports = News




