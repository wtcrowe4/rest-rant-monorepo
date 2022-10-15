const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')

const { User } = db

router.post('/', async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user){
        res.json({error: 'Invalid email'})
    } else {
        const passwordMatch = bcrypt.compareSync(req.body.password, user.passwordDigest)
        if (passwordMatch){
            res.json(user)
        } else {
            res.json({error: 'Invalid password'})
        }
    }
})

module.exports = router
