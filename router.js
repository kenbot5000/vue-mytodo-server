let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let {User, Item} = require('./models');

mongoose.connect('mongodb://localhost/mytodo', { useNewUrlParser: true,  useUnifiedTopology: true }); 

// Get all users
router.get('/users', async (req, res) => {
  let users = await User.find();
  res.json(users);
});

// Get a user
router.get('/users/:username', async (req, res) => {
  let user = await User.findOne({ username: req.params.username });
  if (user != undefined) {
    res.json(user);
  } else {
    res.status = 404;
    res.json({ "response": "User not found!" });
  }
});

// Add a new user
router.post('/users', async (req, res) => {
  let newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  newUser.save();
  res.json(newUser);
});

// Patch a user
router.patch('/users/:username', async(req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (req.body.username) {
      user.username = req.body.username;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    await user.save();
    res.json(user);
  } catch {
    res.status(404);
    res.json({ "response": "User not found!" });
  }
});

// Delete a user
router.delete('/users/:username', async(req, res) => {
  try {
    await User.deleteOne({ username: req.params.username });
    res.status(204).json();
  } catch {
    res.status(404);
    res.json({ "response": "User not found!" });
  }
});

// Get todo items from a user
router.get('/todo/:username', async (req, res) => {
  // Search for user
  let user = await User.findOne({ username: req.params.username });
  if (user != undefined) {
    let todos = user.todos;
    res.json(todos);
  } else {
    res.status(404).json({ "response": "User not found!" });
  }
});

// Add new item to a user
router.post('/todo/:username', async (req, res) => {
    let newTodo = new Item({
      content: req.body.content,
      done: req.body.done
    });

    let user = await User.findOne({ username: req.params.username });
    if(user) {
      user.todos.push(newTodo);
      await user.save();
      res.json(newTodo);
    } else {
      res.status(404).json({ "response": "User not found!" });
    }
}); 

// Patch todo item
router.patch('/todo/:username/:id', async (req, res) => {
  // Search for user
  let user;
  try {
    user = await User.findOne({ username: req.params.username });
  } catch {
    res.status(404).json({ "response": "User not found!" });
  }
  // Search for todo item
  try {
    let item = user.todos.id(req.params.id);
    // Change item content if supplied
    if (req.body.content) {
      item.content = req.body.content;
    }
    if (typeof(req.body.done) == 'boolean') {
      item.done = req.body.done;
    }
    // Parents needs to be saved, not the subdocument
    await user.save();
    res.json(item);

  } catch {
    res.status(404).json({"response": "Item not found!"});
  }
  
});

// Delete todo item
router.delete('/todo/:username/:id', async (req, res) => {
  // Search for user
  let user;
  try {
    user = await User.findOne({ username: req.params.username });
  } catch {
    res.status(404).json({ "response": "User not found!" });
  }

  // Delete item
  try {
    await user.todos.id(req.params.id).remove();
    user.save();
    res.status(204).json();
  } catch {
    res.status(404).json({"response": "Item not found!"});
  }
})
module.exports = router;