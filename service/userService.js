const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../exceptions/apiError');

class userService {
  async registration(email, password, name, surname, userAvatar) {
    const candidate = await userModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await userModel.create({
      name,
      surname,
      email,
      password: hashPassword,
      activationLink,
      userAvatar,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );
    console.log(user, 'its user');

    const userDto = new UserDto(user);
    console.log(userDto, 'its userDto');
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });

    if (!user) throw ApiError.BadRequest('Некорректная ссылка активации!');

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest('Неверный логин или пароль!');
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword)
      throw ApiError.BadRequest('Неверный логин или пароль!');

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      return apiError.unauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw apiError.unauthorizedError();
    }
    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await userModel.find();

    return users;
  }
}

module.exports = new userService();
