const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const jwt = require('json-web-token')

const { User } = db

router.post('/', async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user){
        res.json({error: 'Invalid email'})
    } else {
        const passwordMatch = bcrypt.compareSync(req.body.password, user.passwordDigest)
        if (passwordMatch){
            const result = await jwt.encode(process.env.JWT_SECRET, { id: user.id })
            res.json({ user: user, token: result.value })
        } else {
            res.json({error: 'Invalid password'})
        }
    }
})

router.get('/profile', async (req, res) => {
    
    try {
        const [authMethod, token] = req.headers.authorization.split(' ')
        if (authMethod !== 'Bearer'){
            res.json({error: 'Invalid authorization method'})
        } else {
            const result = await jwt.decode(process.env.JWT_SECRET, token)
            if (result.error){
                res.json({error: 'Invalid token'})
            } else {
                const user = await User.findByPk(result.value.id)
                res.json(user)
            }
        }
    } catch {
        res.json(null)
    }
    
})

module.exports = router
