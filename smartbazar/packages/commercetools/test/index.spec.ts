import jwt_decode from 'jwt-decode';
import commerce from '../dist';

jest.mock('utils/env', () => ({
  getEnv: jest.fn().mockImplementation((key) => key),
}));
jest.mock('axios');
jest.mock('jsonwebtoken');
jest.mock('jwt-decode');

describe('ComerceTools', () => {
  it('helpers.getScope should be called with given token', () => {
    const token = 'dummy_token';
    commerce.helpers.getScope(token);

    expect(jwt_decode).toHaveBeenCalledWith(token);
  });
});
