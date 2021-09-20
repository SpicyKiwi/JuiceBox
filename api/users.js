const express = require('express')
const usersRouter = express.Router()
const jwt = require('jsonwebtoken');

const { getAllUsers, getUserByUsername, createUser } = require('../db')



usersRouter.use(express.json())
usersRouter.use(express.urlencoded({ extended: false }))


usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users")

    next()
})




usersRouter.get('/', async (req, res) => {

    try {
        const users = await getAllUsers()

        res.send({
            users
        })
    } catch (error) {
        throw error
    }
    
})

function encryptData(data) {
    const encryptedData = jwt.sign(data, process.env.JWT_SECRET)

    return encryptedData
}

function decryptData(encryptedData) {
    const decryptedData = jwt.verify(encryptedData, process.env.JWT_SECRET)

    return decryptedData
}

usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body

    try {
        const _user = await getUserByUsername(username)

        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            })
        }

        const user = await createUser({
            username, password, name, location
        })

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        })

        res.send({
            message: "Thank you for signing up!",
            token
        })
    } catch ({ name, message }) {
        next({ name, message})
    }
})

usersRouter.post('/login', async (req, res, next) => {
    console.log("REQ", req.body)

    const { username, password } = req.body

    if(!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        })
    }

    try {
        const user = await getUserByUsername(username)

        if(user && user.password == password) {

            const token = encryptData(user)

            res.send({ message: "you're logged in!", token: token })
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }

})

module.exports = usersRouter