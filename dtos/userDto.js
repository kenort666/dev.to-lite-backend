module.exports = class userDto {
  name;
  surname;
  email;
  id;
  isActivated;
  userAvatar;

  constructor(model) {
    this.name = model.name;
    this.surname = model.surname;
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
    this.userAvatar = model.userAvatar;
  }
};
