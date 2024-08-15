import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error));

const app = express();

const storage = multer.diskStorage({
  destination: (_1, _2, cb) => {
    cb(null, 'uploads');
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());

// Cors
app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  })
);

app.use('/uploads', express.static('uploads')); // чтобы можно было обратиться к картинкам

app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);
app.post('/posts', checkAuth, postCreateValidation, PostController.create); // функции выполняются последовательно, поэтому checkAuth будет выполнен первым чтобы проверить есть ли токен

// Start the server
app.listen(process.env.PORT || 4444, (error) => {
  if (error) {
    console.log('Something went wrong', error);
  } else {
    console.log('Server is running');
  }
});
