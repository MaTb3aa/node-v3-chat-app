let users = [];

const resetUsers = () => {
  users = [];
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  resetUsers
};