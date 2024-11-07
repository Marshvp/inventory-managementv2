require('dotenv').config()
const express = require('express');
const path = require('node:path')
const indexRouter = require('./routes/indexRoutes')
const app = express()

const PORT = 4000
app.use(express.static(path.join(__dirname,'public')))
app.set('views', path.join(__dirname, 'views'))
app.use('/node_modules', express.static('node_modules'));
app.set("view engine", "pug")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log("Listening on port: ", PORT);
})