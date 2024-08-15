import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


import UserModel from '../models/User.js';

export const register = async (req, res) => {

    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10); // Генерируем соль
        const hash = await bcrypt.hash(password, salt); // Хешируем пароль
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl
        });
    
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', { expiresIn: '30d' });

        const { passwordHash, ...userData } = user._doc;
    
        res.json({
            ...userData,
            token
        });  
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Register not complete" });
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(400).json({ message: 'Invalid login or password' });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', { expiresIn: '30d' }); // Создаем токен

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Login not complete" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { passwordHash, ...userData } = user._doc;
    
        res.json({
            userData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "No access" });
    }
};