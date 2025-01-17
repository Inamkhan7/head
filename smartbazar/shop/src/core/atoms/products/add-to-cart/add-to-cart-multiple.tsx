import Counter from '@/core/atoms/ui/counter';
import AddToCartBtn from '@/core/atoms/products/add-to-cart/add-to-cart-btn';
import { cartAnimation } from '@/lib/cart-animation';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartItem } from '@/store/quick-cart/generate-cart-item';
import { useMemo } from 'react';

interface Props {
  data: any[];
  variant?: 'helium' | 'neon' | 'argon' | 'oganesson' | 'single' | 'big';
  counterVariant?:
    | 'helium'
    | 'neon'
    | 'argon'
    | 'oganesson'
    | 'single'
    | 'details';
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
}

export const AddToCart = ({
  data,
  variant = 'helium',
  variation,
  disabled,
}: Props) => {
  const { addItemToCart, isInCart } = useCart();
  const items = useMemo(
    () => data.map((product) => generateCartItem(product, variation)),
    [data, variation]
  );

  const isAllInCart = useMemo(() => {
    let inCart = true;
    for (let i = 0; i < items.length; i++) {
      inCart = isInCart(items[i].id);
      break;
    }
    return inCart;
  }, [isInCart, items]);

  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    items.map((item) => {
      addItemToCart(item, 1);
      cartAnimation(e);
    });
  };
  return (
    <AddToCartBtn
      disabled={disabled || isAllInCart}
      variant={variant}
      onClick={handleAddClick}
    />
  );
};
