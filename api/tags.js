const express = require('express');
const tagsRouter = express.Router()

const { getAllTags, getPostById } = require('../db')

tagsRouter.use((req, res, next) => {
    console.log("A request to the tags page has been made!")

    next()
})

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags()

    res.send({
        tags
    })
})

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params

    try {
        const posts = await getPostById(tagName)

        res.send({ posts: posts })
    } catch ({ name, message }) {
        next({ name, message })
    }
})

module.exports = tagsRouter