const router = require('express').Router();
const sequelize = require('../../config/connection')
const {Post, User, Comment } = require('../../models')

router.get('/:userId', async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {
                userId: req.params.userId
            },
            include: [{ model: User, attributes: ['username'] }],
            attributes: {
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM comment WHERE comment.postId = post.id)'),
                        'commentsCount',
                    ],
                ],
            },
        });

        const serializedPosts = posts.map((post) => post.get({ plain: true}))
        res.status(200).send('<h1>HDASHBOARD</h1><h2>Render the dashboard view along with all posts from logged in user.</h2>')
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        let post = await Post.findOne({
            where: {
                id: req.params.id,
                // userId: req.session.userId
            },
            include: [
                { model: Comment, include: {model: User, attributes: ['username']}},
            ],
            attributes: {
                include: [
                    sequelize.literal('(SELECT COUNT(*) FROM comment WHERE comment.postId = post.id)'),
                    'commentsCount',
                ],
            },
        });

        if (!post) return res.status(404).json({message: 'No post found.'});
        post = post.get({plain: true});

        res.status(200).send('<h1>HDASHBOARD</h1><h2>Render the dashboard view for a single post along with that post retrieved from the database.</h2>')


    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

module.exports = router;