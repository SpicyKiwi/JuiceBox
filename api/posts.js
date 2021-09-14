const express = require('express');
const postsRouter = express.Router()

const { getAllPosts } = require('../db');

postsRouter.use((req, res, next) => {
    console.log("A request has been made to the posts route!")

    next()
})

postsRouter.get('/', async (req, res) => {

    const posts = await getAllPosts()

    res.send({
        posts: posts
    })

})

module.exports = postsRouter