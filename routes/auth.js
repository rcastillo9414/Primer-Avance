const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro, creacion de usuario a nuevo
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Informacion incompleta' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hash, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login para usuarios existentes 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Informacion incompleta' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales incorrectos' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales incorrectos' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
