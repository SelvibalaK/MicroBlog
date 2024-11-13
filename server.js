const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('.'));

const User = mongoose.model('User', {
    username: String,
    password: String
});

const Post = mongoose.model('Post', {
    username: String,
    content: String,
    userId: String,
    date: { type: Date, default: Date.now }
});

app.post('/register', async (req, res) => {
    await new User(req.body).save();
    res.json({ message: '✨ Registered!' });
});

app.post('/login', async (req, res) => {
    const user = await User.findOne(req.body);
    res.json(user ? { userId: user._id } : { error: 'Invalid credentials' });
});

app.post('/post', async (req, res) => {
    await new Post(req.body).save();
    res.json({ message: '✨ Posted!' });
});

app.delete('/post/:id', async (req, res) => {
    await Post.deleteOne({ _id: req.params.id, userId: req.body.userId });
    res.json({ message: '🗑️ Deleted!' });
});

app.get('/posts', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
});

mongoose.connect('mongodb://localhost/microblog', { useNewUrlParser: true })
    .then(() => app.listen(3000, () => console.log('🚀 Server running!')));
