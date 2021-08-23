const jwt = require ('jsonwebtoken')
const Reporters = require('../models/reporters.js')

const auth = async (req,res,next)=>{
try{
    const token = req.header('Authorization').replace('Bearer ','')
    console.log(token)
    // console.log('tessst')
    const decode = jwt.verify(token, 'node-course')
    console.log(decode)
    // console.log('testtt')
    const reporters = await Reporters.findOne({_id:decode._id,'tokens.token':token})
    console.log(reporters)
    if (!reporters){
        console.log('No reporters Is Found')
        throw new Error()
    }
    req.reporters = reporters
    req.token = token
    next()
}
catch(e){
    res.status(401).send({error:'Please authenticate'})
}
}

module.exports = auth 
