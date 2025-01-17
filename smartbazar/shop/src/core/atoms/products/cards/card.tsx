import { Product } from '@/types';
import dynamic from 'next/dynamic';
const Helium = dynamic(() => import('@/core/atoms/products/cards/helium'));
const Neon = dynamic(() => import('@/core/atoms/products/cards/neon')); // grocery-two
const Argon = dynamic(() => import('@/core/atoms/products/cards/argon')); // bakery
const Krypton = dynamic(
  () => import('@/core/atoms/products/cards/krypton') // furniture extra price
);
const Xenon = dynamic(() => import('@/core/atoms/products/cards/xenon')); // furniture-two
const Radon = dynamic(() => import('@/core/atoms/products/cards/radon')); // Book

const MAP_PRODUCT_TO_CARD: Record<string, any> = {
  neon: Neon,
  helium: Helium,
  argon: Argon,
  krypton: Krypton,
  xenon: Xenon,
  radon: Radon,
};
interface ProductCardProps {
  product: Product;
  catalog?: string;
  className?: string;
  productUrlPrefix: string;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  ...props
}) => {
  const Component = product?.type?.settings?.productCard
    ? MAP_PRODUCT_TO_CARD[product?.type?.settings?.productCard]
    : Neon;
  return <Component product={product} {...props} className={className} />;
};
export default ProductCard;
