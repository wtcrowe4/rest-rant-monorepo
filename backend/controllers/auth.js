const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')

const { User } = db

//Login
router.post('/', async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user){
        res.json({error: 'Invalid email'})
    } else {
        const passwordMatch = bcrypt.compareSync(req.body.password, user.passwordDigest)
        if (passwordMatch){
            req.session.userId = user.userId
            res.json(user)
        } else {
            res.json({error: 'Invalid password'})
        }
    }
})

//Session
router.get('/profile', async (req, res) => {
    res.json(req.currentUser)
    // try {
    //     const user = await User.findByPk(req.session.userId)
    //     res.json(user)
    // }
    // catch (err) {
    //     res.json(err)
    // }
})

module.exports = router
