const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./userModel');
const validate = require('../middlewares/validation');

module.exports.users_post_register = async (req, res) => {
  const { error } = validate.registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const validInviterId = await mongoose.isValidObjectId(req.body.inviter);
  if (!validInviterId) return res.status(404).send('Invalid ID');

  const inviterExist = await User.findById(req.body.inviter);
  if (!inviterExist) return res.status(409).send('Inviter record not found');

  const emailExist = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (emailExist) return res.status(409).send('Email already exist');

  const usernameExist = await User.findOne({
    username: req.body.username.toLowerCase(),
  });
  if (usernameExist) return res.status(409).send('Username already exist');

  const hash = await bcrypt.hashSync(req.body.password, 10);

  const newUser = new User({
    name: req.body.name,
    username: req.body.username.toLowerCase(),
    email: req.body.email.toLowerCase(),
    password: hash,
    inviter: req.body.inviter,
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.users_post_login = async (req, res) => {
  const { error } = validate.loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.find({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });

  if (!user || user.length == 0) return res.status(404).send('Auth failed');
  const [currentUser] = user;

  const validPass = await bcrypt.compareSync(
    req.body.password,
    currentUser.password
  );
  if (!validPass) return res.status(400).send('Auth failed');

  try {
    const token = jwt.sign(
      {
        id: currentUser._id,
        name: currentUser.name,
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
      },
      process.env.JWT,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Authentication successful', token });
  } catch (err) {
    res.status(401).send(err);
  }
};

module.exports.users_get_user = async (req, res) => {
  id = req.params.id;
  const validUserId = await mongoose.isValidObjectId(id);
  if (!validUserId) return res.status(400).send('Invalid ID');

  const user = await User.findById(id);
  if (!user) return res.status(404).send('User not found');

  const team = await User.find({ inviter: id });

  try {
    const currentUser = await User.findById(id).populate(
      'inviter',
      'name username email'
    );
    res.status(200).json({ currentUser, team });
  } catch (err) {
    res.status(404).send(err);
  }
};

// Admin routes
module.exports.users_get_all = async (req, res) => {
  try {
    const users = await User.find().populate('inviter');

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.users_patch_role = async (req, res) => {
  const { error } = validate.updateUserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  id = req.params.id;
  const validUserId = await mongoose.isValidObjectId(id);
  if (!validUserId) return res.status(400).send('Invalid ID');

  const user = await User.findById(id);
  if (!user) return res.status(404).send('User not found');

  try {
    const updateUser = await User.update(
      { _id: id },
      {
        $set: {
          role: req.body.role ? req.body.role : user.role,
        },
      }
    );

    res.status(200).json({ message: 'User updated', updateUser });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.users_patch_user = async (req, res) => {
  const { error } = validate.updateUserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  id = req.params.id;
  const validUserId = await mongoose.isValidObjectId(id);
  if (!validUserId) return res.status(400).send('Invalid ID');

  const user = await User.findById(id);
  if (!user) return res.status(404).send('User not found');

  try {
    const updateUser = await User.update(
      { _id: id },
      {
        $set: {
          isActive: req.body.isActive ? req.body.isActive : user.isActive,
          name: req.body.name ? req.body.name : user.name,
          username: req.body.username ? req.body.username : user.username,
          email: req.body.email ? req.body.email : user.email,
        },
      }
    );

    res.status(200).json({ message: 'User updated', updateUser });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.users_delete_user = async (req, res) => {
  const id = req.params.id;
  const validateUserId = await mongoose.isValidObjectId(id);
  if (!validateUserId) return res.status(400).send('Invalid ID');

  const user = await User.findById(id);
  if (!user) return res.status(404).send('User not found');

  try {
    await User.findById(id).remove();
    res.sendStatus(204);
  } catch (err) {
    res.status(404).send(err);
  }
};
