const apiError = require('../exceptions/apiError');
const tokenService = require('../service/tokenService');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(apiError.UnauthorizedError());
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) return next(apiError.UnauthorizedError());

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(apiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (err) {
    return next(apiError.UnauthorizedError());
  }
};
