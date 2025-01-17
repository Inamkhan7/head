import { useRouter } from 'next/router';
import cn from 'classnames';
import { getIcon } from '@/lib/get-icon';
import * as CategoryIcons from '@/core/atoms/icons/category';

interface CategoryItemProps {
  item: any;
}
const CategoryItem: React.FC<CategoryItemProps> = ({ item }) => {
  const router = useRouter();

  const { pathname, query } = router;
  const selectedQueries = query.category;

  const onCategoryClick = (slug: string) => {
    if (selectedQueries === slug) {
      const { category, ...rest } = query;
      router.push(
        {
          pathname,
          query: { ...rest },
        },
        undefined,
        {
          scroll: false,
        }
      );
      return;
    }
    router.push(
      {
        pathname,
        query: { ...query, category: slug },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  return (
    <div
      className={cn(
        'relative flex cursor-pointer flex-col items-center justify-start overflow-hidden rounded border-2 bg-light py-4 text-center',
        selectedQueries === item?.slug
          ? 'border-gray-800'
          : 'border-border-100 xl:border-transparent'
      )}
      role="button"
      onClick={() => onCategoryClick(item?.slug!)}
    >
      <div className="flex h-20 w-full items-center justify-center">
        <span className="inline-block h-10 w-10">
          {getIcon({
            iconList: CategoryIcons,
            iconName: item?.icon!,
            className: 'w-10 h-10',
          })}
        </span>
      </div>

      <span className="block px-2.5 text-center text-sm font-semibold text-heading">
        {item?.name}
      </span>
    </div>
  );
};

function OutlinedBoxedCategoryMenu({ items }: any) {
  return (
    <>
      {items?.map((item: any) => (
        <CategoryItem key={`${item.name}${item.slug}`} item={item} />
      ))}
    </>
  );
}

export default OutlinedBoxedCategoryMenu;
