const db = require('../models')
const jwt = require('json-web-token')

const { User } = db

const defineCurrentUser = async (req, res, next) => {
    try {
        const [method, token] = req.headers.authorization.split(' ')
        if (method === 'Bearer') {
            const result = await jwt.decode(process.env.JWT_SECRET, token)
            const { id } = result.value
            const user = await User.findByPk(id)
            req.currentUser = user
        }
        next()
    } catch (error) {
        req.currentUser = null
        next()
    }
}


module.exports = defineCurrentUser