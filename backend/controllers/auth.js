const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const jwt = require('json-web-token')


const { User } = db
const jwtSecret = process.env.JWT_SECRET

router.post('/', async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user){
        res.json({error: 'Invalid email'})
    } else {
        const passwordMatch = bcrypt.compareSync(req.body.password, user.passwordDigest)
        if (passwordMatch){
            const result = await jwt.encode(process.env.JWT_SECRET, { id: user.userId })
            res.json({ user: user, token: result.value })
        } else {
            res.json({error: 'Invalid password'})
        }
    }
})

router.get('/profile', async (req, res) => {
    res.json(req.currentUser)
})
    // try {
    //     const [authMethod, token] = req.headers.authorization.split(' ')
    //     if(authMethod === 'Bearer'){
    //         const result = await jwt.decode(jwtSecret, token)
    //         if(!result.error){
    //             const { id } = result.value
    //             const user = await User.findByPk(id)
    //             res.json(user)
    //         } else {
    //             res.json(null)
    //             console.log('Error: Invalid Token')
    //         }
    //     } else {
    //         res.json(null)
    //         console.log('Error: Invalid authorization method')
    //     }
    
    // } catch {
    //     res.json(null)
    // }
    


module.exports = router
