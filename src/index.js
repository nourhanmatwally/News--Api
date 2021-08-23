const express = require('express')
const newsRouter = require('./routers/reporters')
require('./db/mongoose')

const app = express()
app.use(express.json()) // retern data json to --> object
app.use(newsRouter)
const port = 3000
app.listen(port, () => {
    console.log('Serner Is Running');
})

