const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

router.get('/', (req, res) => {
    Blog
        .find()
        .then(blogs => res.status(200).json(blogs))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Must come before '/:id' so "featured" isn't treated as an id
router.get('/featured', (req, res) => {
    Blog
        .where({ featured: true })
        .then(blogs => res.status(200).json(blogs))
        .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', (req, res) => {
    Blog
        .findById(req.params.id)
        .then(blog => {
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            res.status(200).json(blog);
        })
        .catch(() => res.status(404).json({ error: 'Blog not found' }));
});

router.post('/', (req, res) => {
    let dbUser = null;

    User
        .findById(req.body.author)
        .then(user => {
            if (!user) throw new Error('Author not found');

            dbUser = user;

            const newBlog = new Blog(req.body);
            newBlog.author = user._id;

            return newBlog.save();
        })
        .then(blog => {
            dbUser.blogs.push(blog._id);

            return dbUser.save().then(() => blog);
        })
        .then(blog => res.status(201).json(blog))
        .catch(err => res.status(400).json({ error: err.message }));
});

router.put('/:id', (req, res) => {
    Blog
        .findByIdAndUpdate(req.params.id, req.body, { runValidators: true })
        .then(blog => {
            if (!blog) return res.status(404).json({ error: 'Blog not found' });
            res.status(204).end();
        })
        .catch(err => res.status(400).json({ error: err.message }));
});

router.delete('/:id', (req, res) => {
    Blog
        .findByIdAndRemove(req.params.id)
        .then(blog => {
            if (!blog) return res.status(404).json({ error: 'Blog not found' });

            // Keep the author's blog list in sync
            return User
                .updateOne({ _id: blog.author }, { $pull: { blogs: blog._id } })
                .then(() => res.status(200).json(blog));
        })
        .catch(() => res.status(404).json({ error: 'Blog not found' }));
});

module.exports = router;
