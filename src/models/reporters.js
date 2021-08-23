const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// {
    
    //     "reporters.name":"nour",
    //     "reporters.age":24,
    //     "reporters.email":"nour32233@gmail.com",
    //     "reporters.password":"nour1234",
    //       "news.title":"ginaa",
    //       "news.discription":"ginaa233"
         
    //
//}

const reportersSchema = new mongoose.Schema({
    // reporters: {
        name: {
            type: String,
            require: true,
            trim: true
        },
        age: {
            type: Number,
            default: 23,
            validator(value) {
                if (value < 0) {
                    throw new Error('Age Must Be A Positive Number')
                }
            }
        },
        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
            validator(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Wrong Email')
                }
            }
        },
        password: {
            type: String,
            require: true,
            tirm: true,
            minLength: 6
        },
        tokens: [
            {
                token: {
                    type: String,
                    require: true
                }
            }
        ],
        avatar: {
            type: Buffer
        }
    })

// })



///////////////////
// Hash password
///////////////////

reportersSchema.pre('save', async function (next) {
    const reporters = this
    console.log(reporters);
    if (reporters.isModified('password')) {
        reporters.password = await bcrypt.hash(reporters.password, 8)
    }
    next()
})

///////////////////////////
// Token
///////////////////////////

reportersSchema.methods.generateToken = async function () {
    const reporters = this
    const token = jwt.sign({ _id: reporters._id.toString() }, 'node-course')
    reporters.tokens = reporters.tokens.concat({ token: token})
    await reporters.save()
    return token
}

////////////////////////////
// Login
////////////////////////////

reportersSchema.statics.findByCredentials = async (email, password) => {
    const reporters = await Reporters.findOne({ email })
    console.log(reporters)
    if (!reporters) {
        throw new Error('Unable To Login. Plz Check Email Or Password')
    }
    const isMatch = await bcrypt.compare(password, reporters.password)
    if (!isMatch) {
        throw new Error('Unable To Login. Plz Check Email Or Password')
    }
    return reporters
}


////////////////////////
// Relation
////////////////////////

// userSchema.virtual('news',{
//     ref:'News',
//     localField:'_id',
//     foreignField:'title'
// })



const Reporters = mongoose.model('Reporters', reportersSchema)
module.exports = Reporters









