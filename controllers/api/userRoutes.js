const router = require('express').Router();
const sequelize = require('../../config/connection')
const {User, Post, Comment} = require('../../models')


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
});

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['password'],
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM post WHERE post.userId = user.id)'),
                        'postsCount',
                    ],
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM comment WHERE comment.userId = user.id)'),
                        'commentsCount',
                    ],
                ],
            },
        });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [
                { model: Post },
                { model: Comment, include: { model: Post, attributes: 
                ['title'] } }
                ],
            attributes: {
                exclude: ['password'],
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM post WHERE post.userId = user.id)'),
                        'postsCount',
                    ],
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM comment WHERE comment.userId = user.id)'),
                        'commentsCount',
                    ],
                ]
            },
        });

        if (!user) return res.status(404).json({ message: 'No user foudnd.' });

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})


module.exports = router;