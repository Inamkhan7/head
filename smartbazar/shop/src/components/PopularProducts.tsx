import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useProducts } from '@/framework/product';
import Neon from '@/core/atoms/products/cards/neon';
import Image from 'next/image';
import ProductCard from '@/core/atoms/products/cards/card';
import { Grid } from '@/core/atoms/products/grid';
import CartCounterButton from '@/core/atoms/cart/cart-counter-button';

const PopularProducts = () => {
  const [variables, setVariables] = useState({});
  useEffect(() => {
    setVariables({ type: 'watts', limit: 3 });
  }, []);

  const { query } = useRouter();
  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
    useProducts({
      ...variables,
      ...(query.category && {
        categories: Array.isArray(query.category)
          ? query.category[0]
          : query.category,
      }),
      ...(query.text && {
        text: Array.isArray(query.text) ? query.text[0] : query.text,
      }),
    });

  return (
    <div className="mx-auto flex flex-col w-full max-w-7xl justify-center align-middle">
       <section className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <header className="relative text-center">
          <h2 className="font-sans text-xl md:text-2xl xl:text-6xl">
          Popular Products
          </h2>         
        </header>
      </section>

      <Grid
        products={products}
        loadMore={loadMore}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={error}
        gridClassName={'grid-cols-3'}
        productUrlPrefix={`${variables.type}/products`}
      />
      <CartCounterButton />
    </div>
  );
};

export default PopularProducts;
