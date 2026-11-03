const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    User
        .find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then(user => {
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.status(200).json(user);
        })
        .catch(() => res.status(404).json({ error: 'User not found' }));
});

router.post('/', (req, res) => {
    new User(req.body)
        .save()
        .then(user => res.status(201).json(user))
        .catch(err => res.status(400).json({ error: err.message }));
});

router.put('/:id', (req, res) => {
    User
        .findByIdAndUpdate(req.params.id, req.body, { runValidators: true })
        .then(user => {
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.status(204).end();
        })
        .catch(err => res.status(400).json({ error: err.message }));
});

router.delete('/:id', (req, res) => {
    User
        .findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.status(200).json(user);
        })
        .catch(() => res.status(404).json({ error: 'User not found' }));
});

module.exports = router;
