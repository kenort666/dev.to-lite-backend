const userController = require('../controllers/userController.js');
const postController = require('../controllers/postController.js');
const upload = require('../multer/index.js');
const Router = require('express').Router;
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const {
  postCreateVal,
  registrationVal,
} = require('../validation/validations.js');
const commentsController = require('../controllers/commentsController.js');

router.post('/registration', registrationVal, userController.registration);

router.post('/login', registrationVal, userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

// Posts
router.get('/posts', postController.getPosts);
router.get('/posts/:id', postController.getOne);
router.post(
  '/createPosts',
  authMiddleware,
  postCreateVal,
  postController.createNewPost
);
router.delete('/posts/:id', authMiddleware, postController.deleteOne);
router.patch('/posts/:id', authMiddleware, postController.updateOne);

// Comments
router.put('/comment/:id', authMiddleware, commentsController.addComment);
router.get('/comments', commentsController.getFirstComments);
router.patch('/comment', commentsController.deleteComment);

// Tags
router.get('/tags', postController.getTags);
router.get('/tags/:name', postController.getPostsByTags);

// Upload;
router.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
