const router = require('express').Router();
const sequelize = require('../../config/connection')
const { Post, User, Comment } = require('../../models');


router.post('/', async (req, res) => {
    try {
        const newComment = await Comment.create({
            text: req.body.text,
            postId: req.body.postId,
            userId: req.body.userId
        });
        res.status(201).json(newComment)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


router.get('/', async (req, res) => {
    try {
      const comments = Comment.findAll({
        include: [
        { model: User, attributes: ['username']},
        { model: Post, include: {model: User, attributes: ['username']}},
    ],
      });
      res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); 
    }
});

router.get('/:commentId', async (req, res) => {
    try {
      const comment = Comment.findByPk(req.params.commentId, {
        include: [
        { model: User, attributes: ['username']},
        { model: Post, include: {model: User, attributes: ['username']}},
    ],
      });
      res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); 
    }
});

router.put('/:commentId', async (req, res) => {
    try {
        const updatedComment = await Comment.update(req.body, {
            where: {
                id: req.params.commentId,
                userId: req.session.userId
            }
        });

        if (!updatedComment[0]) return res.status(406).json({message: 'This request cannot be completed.'});

        res.status(202).json(updatedComment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); 
    }
})

router.delete('/:commentId', async (req, res) => {
    try {
        const deletedComment = await Comment.destroy({
            where: {
                id: req.params.commentId,
                userId: req.sessions.userId
            }
        });

        if (!deletedComment) return res.status(406).json({message: 'This request cannot be completed.'})

        res.status(202).json(deletedComment)
    } catch (error) {
        console.log(error);
        res.status(500).json(error); 
    }
});


module.exports = router;