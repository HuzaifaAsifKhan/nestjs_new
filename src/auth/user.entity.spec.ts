jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('UserEntity', () => {
  let user;

  describe('validatePassword', () => {
    beforeEach(() => {
      user = new User();
      user.salt = 'TestSalt';
      user.password = 'some hash';
      (bcrypt.hash as jest.Mock).mockReset();
    });
    it('return true, if valid', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('some hash');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('12345');
      expect(bcrypt.hash).toHaveBeenCalledWith('12345', 'TestSalt');
      expect(result).toEqual(true);
    });
    it('return false, if in-valid', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('some hash but wrong');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('12345');
      expect(bcrypt.hash).toHaveBeenCalledWith('12345', 'TestSalt');
      expect(result).toEqual(false);
    });
  });
});
