import { Category } from '@/types';
import dynamic from 'next/dynamic';

const Neon = dynamic(() => import('@/core/atoms/categories/cards/neon'));

interface categoryCardProps {
  category: Category;
  className?: string;
  catalog: string;
  catalogName?: string;
}
const categoryCard: React.FC<categoryCardProps> = ({
  category,
  className,
  ...props
}) => {
  return <Neon category={category} {...props} className={className} />;
};
export default categoryCard;
