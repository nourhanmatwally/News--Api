const express = require('express')
const router = new express.Router()
const Reporters = require('../models/reporters.js')
const jwt = require('jsonwebtoken')
const auth = require('../middleweare/auth')
const multer = require('multer')


///////////////////////////////////
// Post
///////////////////////////////////

router.post('/reporters', async (req, res) => {
    const reportersIn = new Reporters(req.body)
    try {
        await reportersIn.save()
        const token = await reportersIn.generateToken()
        res.status(200).send({ reportersIn, token })
    }
    catch (e) {
        res.status(400).send('error ' + e)
    }
})


///////////////////////////////////
// Get All
///////////////////////////////////

router.get('/reporters', auth, (req, res) => {
    Reporters.find({}).then((reporters) => {
        res.status(200).send(reporters)
    }).catch((e) => {
        res.status(500).send('Error ' + e)
    })
})


///////////////////////////////////
// Get By Id
///////////////////////////////////

router.get('/reporters/:id', auth, (req, res) => {
    const _id = req.params.id
    Reporters.findById(_id).then((reporters) => {
        if (!reporters) {
            return res.status(404).send('Unable To Find Reporters')
        }
        res.status(200).send(reporters)
    }).catch((e) => {
        res.status(500).send('Unable To Find Reporters')
    })
})


///////////////////////////////////
// Patch / Update
///////////////////////////////////

router.patch('/reporters/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(updates)
    const _id = req.params.id
    try {
        const reporters = await Reporters.findById(_id)
        updates.forEach((update) => reporters[update] = req.body[update])
        await reporters.save()
        if (!reporters) {
            return res.send('No reporters Is Found')
        }
        res.status(200).send(reporters)
    }
    catch (e) {
        res.status(400).send('Error Has Occured ' + e)
    }
})


///////////////////////////////////
// Delete
///////////////////////////////////

router.delete('/reporters/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const reporters = await Reporters.findByIdAndDelete(_id)
        if (!reporters) {
            return res.send('No reporters Is Found')
        }
        res.send(reporters)
    }
    catch (e) {
        res.send('Error ' + e)
    }
})


///////////////////////////////////
// LogIn
///////////////////////////////////

router.post('/reporters/login', async (req, res) => {
    try {
        const reporters = await Reporters.findByCredentials(req.body.email, req.body.password)
        const token = await reporters.generateToken()
        res.send({ reporters, token })
    }
    catch (e) {
        res.send('Try Again ' + e)
    }
})


///////////////////////////////////
// LogOut
///////////////////////////////////

router.delete('/logout', auth, async (req, res) => {
    try {
        req.reporters.token = req.reporters.tokens.filter((el) => {
            return el.token !== req.token
        })
        await req.reporters.save()
        res.send('LogOut Success')
    }
    catch (e) {
        res.send('Error ' + e)
    }
})


///////////////////////////////////
// LogOut All
///////////////////////////////////

router.delete('logoutall', auth, async (req, res) => {
    try {
        req.reporters.tokens = []
        await req.reporters.save()
        res.send('LogoutAll Is Run Success')
    }
    catch (e) {
        res.send('Error ' + e)
    }
})


///////////////////////////////////
// Profile Image
///////////////////////////////////

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            return cb(new Error('Pleas Upload An Image'))
        }
        cb(null, true)
    }
})

router.post('/profile/avatar', auth, upload.single('image'), async (req, res) => {
    try {
        req.reporters.avatar = req.file.buffer
        await req.reporters.save()
        res.send('Image Uploaded')
    }
    catch (e) {
        res.send('Error ' + e)
    }
})


module.exports = router