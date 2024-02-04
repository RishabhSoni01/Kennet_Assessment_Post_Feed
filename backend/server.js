const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

const dotenv = require("dotenv").config();
mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(console.log('connect sucess to mongodb'))

const postSchema = new mongoose.Schema({
  userName: String,
  message: String,
  comments: [{ userName: String, message: String }],
});             

const Post = mongoose.model('Post', postSchema);

const users = [];

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: 'Username and password are required' });
  }
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.json({ success: false, message: 'Username already exists' });
  }
  users.push({ username, password });
  res.json({ success: true });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username && user.password === password);
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid username or password' });
  }
});

app.post('/logout', (req, res) => {
  // You might want to perform additional cleanup if necessary
  res.json({ success: true });
});

app.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ _id: -1 });
  res.json(posts);
});

app.options('*', cors());

app.post('/posts', async (req, res) => {
  const post = new Post({ userName: req.body.userName, message: req.body.message });
  await post.save();
  res.json(post);
});

app.post('/posts/:id/comments', async (req, res) => {
  const post = await Post.findById(req.params.id);
  const comment = { userName: req.body.userName, message: req.body.message };
  post.comments.push(comment);
  await post.save();
  res.json(comment);
});

app.post('/search', async (req, res) => {
  const { search } = req.body;
  let searchString = '';
  if (typeof search === 'string') {
    searchString = search.toString();
  }
  const posts = await Post.find({
    $or: [
      { userName: { $regex: searchString, $options: 'i' } },
      { message: { $regex: searchString, $options: 'i' } },
      { 'comments.userName': { $regex: searchString, $options: 'i' } },
      { 'comments.message': { $regex: searchString, $options: 'i' } },
    ],
  });
  res.json(posts);
});

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));