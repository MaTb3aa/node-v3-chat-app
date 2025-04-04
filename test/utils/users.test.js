const { expect } = require('chai');
const { addUser, removeUser, getUser, getUsersInRoom, resetUsers } = require('../../utils/users');

describe('User Utilities', () => {
  beforeEach(() => resetUsers());

  describe('addUser()', () => {
    it('should add valid user', () => {
      const { user } = addUser({ id: '123', username: 'John', room: 'Dev' });
      expect(user).to.deep.equal({ id: '123', username: 'John', room: 'Dev' });
    });

    it('should reject duplicate username', () => {
      addUser({ id: '123', username: 'John', room: 'Dev' });
      const { error } = addUser({ id: '456', username: 'John', room: 'Dev' });
      expect(error).to.equal('Username is already in use!');
    });
  });

});