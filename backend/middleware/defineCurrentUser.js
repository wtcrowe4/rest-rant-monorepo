const db = require('../models')

const { User } = db

const defineCurrentUser = async (req, res, next) => {
    try{
        let user = await User.findByPK(req.session.userId)
        req.currentUser = user
        next()
    } catch {
        next()
    }
}

module.exports = defineCurrentUser