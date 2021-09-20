const express = require('express');
const postsRouter = express.Router()

const { getAllPosts } = require('../db');

postsRouter.use((req, res, next) => {
    console.log("A request has been made to the posts route!")

    next()
})

postsRouter.get('/test', (req, res, next) => {
    res.send("It workssss")
})

postsRouter.get('/', async (req, res, next) => {

    try {
        const allPosts = await getAllPosts()

        const post = allPosts.filter(post => {
            if (post.active) {
                return true
            }
            if (req.user && post.author.id === req.user.id) {
                return true
            }
            return false
        })

        //console.log("POST", post)

        res.send({
            post
        })
    } catch ({ name, message }) {
        next({ name, message })
    }



})

module.exports = postsRouter