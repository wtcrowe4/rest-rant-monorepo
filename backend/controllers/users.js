const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')

const { User } = db

router.post('/', async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const user = await User.create({
        firstName,
        lastName,
        email,
        passwordDigest: bcrypt.hashSync(password, 10),
        role: 'user'
    })
    res.json(user)
})


router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

module.exports = router