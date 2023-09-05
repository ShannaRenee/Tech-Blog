const router = require('express').Router();
const sequelize = require('../../config/connection')
const {Post, User, Comment } = require('../../models')

router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
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
        res.status(200).render('homepage', { posts: serializedPosts, loggedIn: true,
         })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/post/:Id', async (req, res) => {
    try {
        let post = await Post.findByPk(req.params.postId, {
            include: [
                { model: User, attributes: ['username'] },
                { model: Comment, include: { model: User, attributes:
                ['username']}},
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM comment WHERE comment.postId = post.id)'),
                        'commentsCount',
                    ],
                ],
            },
        });
        if(!post) return res.status(404).json({message: 'No post found.'})

        post = post.get({plain: true })
        res.status(200).send('<h1>SINGLE POST PAGE</h1><h2>Render the view for a single post along with the post retrieved.</h2>')

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/signup', async (req, res) => {
    res
    .status(200)
    .send('<h1>SIGN UP PAGE</h1><h2>Render the signup view.</h2>')
});

router.get('/login', async (req, res) => {
    res
    .status(200)
    .send('<h1>LOGIN PAGE</h1><h2>Render the login view.</h2>')
});

module.exports = router