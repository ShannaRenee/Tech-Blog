const router = require('express').Router();
const sequelize = require('../../config/connection')
const { Post, User, Comment } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const newPost = await Post.create({
            title: req.body.title,
            text: req.body.text,
            userId: req.body.userId,
        });
        res.status(201).json(newPost)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

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
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.get('/:postId', async (req, res) => {
    try {
        const posts = await Post.findByPk(req.params.postId, {
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
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.put('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.update(req.body, {
            where: {
                id: req.params.postId,
                userId: req.body.userId
            }
        });
        console.log(updatedPost);

        if (!updatedPost[0])
         return res
        .status(406)
        .json({message: 'This request cannot be completed'})
        res.status(202).json(updatedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.delete('/:postId', async (req, res) => {
    try {
        const deletedPost = await Post.destroy({
            where: {
                id: req.params.postId,
                userId: req.session.userId
            }
        });

        if (!deletedPost) return res.status(406).json({message: 'This request cannot be completed'})

        res.status(202).json(deletedPost)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})


module.exports = router;
