const router = require('express').Router()
const db = require("../models")
const jwt = require('json-web-token')

const { Place, Comment, User } = db

router.post('/', async (req, res) => {
    if(req.currentUser?.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to add a place.' })
    }
    if (!req.body.pic) {
        req.body.pic = 'http://placekitten.com/400/400'
    }
    if (!req.body.city) {
        req.body.city = 'Anytown'
    }
    if (!req.body.state) {
        req.body.state = 'USA'
    }
    const place = await Place.create(req.body)
    res.json(place)
})


router.get('/', async (req, res) => {
    const places = await Place.findAll()
    res.json(places)
})


router.get('/:placeId', async (req, res) => {
    let placeId = Number(req.params.placeId)
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else {
        const place = await Place.findOne({
            where: { placeId: placeId },
            include: {
                association: 'comments',
                include: 'author'
            }
        })
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` })
        } else {
            res.json(place)
        }
    }
})

router.put('/:placeId', async (req, res) => {
    if(req.currentUser?.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to update a place.' })
    }
    let placeId = Number(req.params.placeId)
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else {
        const place = await Place.findOne({
            where: { placeId: placeId },
        })
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` })
        } else {
            Object.assign(place, req.body)
            await place.save()
            res.json(place)
        }
    }
})

router.delete('/:placeId', async (req, res) => {
    if(req.currentUser?.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to delete a place.' })
    }
    let placeId = Number(req.params.placeId)
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else {
        const place = await Place.findOne({
            where: {
                placeId: placeId
            }
        })
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` })
        } else {
            await place.destroy()
            res.json(place)
        }
    }
})

router.post('/:placeId/comments', async (req, res) => {
    const placeId = Number(req.params.placeId)

    req.body.rant = req.body.rant ? true : false

    const place = await Place.findOne({
        where: { placeId: placeId }
    })

    if (!place) {
        res.status(404).json({ message: `Could not find place with id "${placeId}"` })
    }

    // const author = await User.findOne({
    //     where: { userId: req.body.authorId }
    // })
    //Code to automatically assign the signed in user as the author of the comment
    // let currentUser;
    // try{
    //     const [method, token] = req.headers.authorization.split(' ')
    //     if (method === 'Bearer') {
    //         const result = jwt.decode(process.env.JWT_SECRET, token)
    //         const { id } = result.value
    //         currentUser = await User.findByPk(id) 
    //     }
    // } catch (err) {
    //     console.log(err)
    //     currentUser = null
    // }

    // if (!author) {
    //     res.status(404).json({ message: `Could not find author with id "${req.body.authorId}"` })
    // }
    //Check to see if the user is signed in
    if (!req.currentUser) {
        res.status(404).json({ message: `You must be signed in to comment` })
    }

    const comment = await Comment.create({
        ...req.body,
        authorId: req.currentUser.userId,
        placeId: placeId
    })

    res.send({
        ...comment.toJSON(),
        author: req.currentUser
    })
})

router.delete('/:placeId/comments/:commentId', async (req, res) => {
    let placeId = Number(req.params.placeId)
    let commentId = Number(req.params.commentId)

    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else if (isNaN(commentId)) {
        res.status(404).json({ message: `Invalid id "${commentId}"` })
    } else {
        const comment = await Comment.findOne({
            where: { commentId: commentId, placeId: placeId }
        })
        if (!comment) {
            res.status(404).json({ message: `Could not find comment with id "${commentId}" for place with id "${placeId}"` })
        } else if (comment.authorId !== req.currentUser.userId) {
            res.status(404).json({ message: `You are not authorized to delete this comment` })
        } else {
            await comment.destroy()
            res.json(comment)
        }
    }
})


module.exports = router