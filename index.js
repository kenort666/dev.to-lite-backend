const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index.js');
const errorMiddleware = require('./middleware/errorMiddleware.js');

require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use('/api/uploads', express.static('uploads'));
app.use('/api', router);
app.use(errorMiddleware);

const startApp = async () => {
  try {
    app.listen(PORT, () => console.log(`Сервер запущен на порте ${PORT}`));

    await mongoose
      .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('Подключение к бд успешно'));
  } catch (err) {
    console.log(err);
  }
};
startApp();
