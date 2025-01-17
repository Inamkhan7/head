import BakeryCategoryLoader from '@/core/atoms/ui/loaders/bakery-categories-loader';
import NotFound from '@/core/atoms/ui/not-found';
import SectionBlock from '@/core/atoms/ui/section-block';
import SolidCardCategory from '@/core/atoms/ui/solid-card-category';
import { Category } from '@/types';
interface SlidingCardCategoriesProps {
  notFound: boolean;
  loading: boolean;
  categories: Category[];
}

const SlidingCardCategories: React.FC<SlidingCardCategoriesProps> = ({
  notFound,
  categories,
  loading,
}) => {
  if (loading) {
    return (
      <div className="hidden xl:block">
        <div className="mt-8 flex h-52 w-full justify-center px-2">
          <BakeryCategoryLoader />
        </div>
      </div>
    );
  }
  return (
    <SectionBlock title="text-which-book">
      {!notFound ? (
        <SolidCardCategory items={categories} className="py-8" />
      ) : (
        <div className="min-h-full">
          <NotFound text="text-no-category" className="h-96" />
        </div>
      )}
    </SectionBlock>
  );
};

export default SlidingCardCategories;
