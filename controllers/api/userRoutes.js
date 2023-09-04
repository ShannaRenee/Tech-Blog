const router = require('express').Router();
const {User} = require('../../models')


router.post('/', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        res.status(201).json(newUser)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})


module.exports = router;