import jwt_decode from 'jwt-decode';
import commerce from '../dist';

jest.mock('jwt-decode');

describe('BigCommerce', () => {
  it('helpers.getScope should be called with given token', () => {
    const token = 'dummy_token';
    commerce.helpers.getScope(token);

    expect(jwt_decode).toHaveBeenCalledWith(token);
  });
});
