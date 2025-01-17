import { Product } from '../dist/products';

describe('Products', () => {
  it('Should create new Product entity', () => {
    const product = new Product();

    expect(product).toBeDefined();
  });
});
