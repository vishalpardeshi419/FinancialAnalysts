const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
    const {username, email, password, role ,current_plan, trial_end_date} = req.body;
    const hasedPassword = await bcrypt.hash(password, 10);
    if (!username || !hasedPassword || !role || !email) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const user = await User.create({username, email, password: hasedPassword, role, current_plan, trial_end_date});
        res.status(201).json({message: 'User Created', user});
    } catch (error) {
        res.status(201).json({error: error});
    }
}

const login = async (req, res) => {
    const {username, password} = req.body;
    console.log("username", username);
    try {
        const user = await User.findOne({ where: { username } });
        if(!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' }); 

        const tokenJwt = jwt.sign({userId: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE })
        res.status(200).json({ message: 'Login successful', tokenJwt });
    } catch (error) {        
        res.status(400).json({ error: error.message });
    }
}


module.exports = {register, login}