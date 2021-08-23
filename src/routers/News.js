const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const News = require('../models/News')



////////////////////////
// post
////////////////////////

router.post('/news', auth, async (req, res) => {
    // console.log(req.body)
    const news = new News({ ...req.body, title: req.reporters._id })
    try {
        await news.save(
            res.status(200).send(news)
        )
    }
    catch (e) {
        res.status(400).send('error ' + e)
    }
})

///////////////////////////////////////////////////////
// router.post('/news', async (req, res) => {
//     // console.log(req.body)
//     const news = new News(req.body)
//     task.save().then(() => {
//         res.status(200).send(news)
//     }).catch((e) => {
//         res.status(400).send('Error' + e)
//     })
// })
///////////////////////////////////////////////////////


////////////////////////
//get all
////////////////////////

router.get('/news',auth, async (req, res) => {
    try {
        await req.reporters.populate('news').execPopulate()
        res.send(req.reporters.news)
    }
    catch (e) {
        res.send(500).send('error ' + e)
    }
})

////////////////////////
//get By Id
////////////////////////

router.get('/news/:id', auth, async (req, res) => {

    const _id = req.params.id
    try {
        const news = await News.findOne({ _id, title: req.reporters._id })
        if (!news) {
            return res.status(404).send('news Is Not Found')
        }
        res.status(200).send(news)
    }
    catch (e) {
        res.status(500).send('error ' + e)
    }
})

////////////////////////
//patch
////////////////////////

router.patch('/news/:id',auth , async (req, res) => {
    const _id = req.params.id
    const update = Object.keys(req.body)
    try {
        const news = await News.findOne({_id,title:req.reporters._id })
           
        // new: true, runValidators: true 

        if (!news) {
            return res.send('No news Is Found')
        }
        res.status(200).send(news)
    }
    catch (e) {
        res.status(400).send('Error ' + e)
    }
})

////////////////////////
//delete
////////////////////////

router.delete('/news/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        const news = await News.findOneAndDelete({_id,title:req.reporters._id})
        if (!news) {
            return res.send('No news')
        } res.send(news)
    }
    catch (e) {
        res.send('error ' + e)
    }
})


/////////////////////////////////
// News Image
/////////////////////////////////

const uploaded = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            return cb(new Error ('Pleas Upload An Image'))
        }
        cb(null,true)
    }
})

router.post('/news/avatar',auth,upload.single('image'),async(req,res)=>{
    try{
        const news = await News.findOne({_id, title:req.reporters._id})
       if(!news){
           return res.status(400).send('No News Is Found')
       }
       news.image = req.file.buffer
       news.save()
       res.send('saved')
    }
    catch (e){
        res.send('Error ' + e)
    }
})


module.exports = router