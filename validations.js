import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Email is not correct').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 })
];

export const registerValidation = [
    body('email', 'Email is not correct').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
    body('fullName', 'Name must be at least 3 characters long').isLength({ min: 3 }),
    body('avatarUrl', 'URL is not correct').optional().isURL()
];

export const postCreateValidation = [
    body('title', 'Enter title name').isLength({min: 3}).isString(),
    body('text', 'Enter post text').isLength({min: 10}).isString(),
    body('tags', 'Tags have wrong format (must be an array)').optional().isString(),
    body('imageUrl', 'URL is not correct').optional().isString()
];