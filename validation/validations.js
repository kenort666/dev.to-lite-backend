const { body } = require('express-validator');

const postCreateVal = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 5 }).isString(),
  body('tags', 'Введите тэги статьи').isLength({ min: 1 }).isArray(),
  body('imageUrl', 'Отсутвует ссылка на изображение')
    .isLength({ min: 1 })
    .isString(),
];

const registrationVal = [
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
];
  
module.exports = { registrationVal, postCreateVal };
