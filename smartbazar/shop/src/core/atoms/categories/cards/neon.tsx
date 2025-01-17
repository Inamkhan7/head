import { Image } from '@/core/atoms/ui/image';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { productPlaceholder } from '@/lib/placeholders';
import Link from '@/core/atoms/ui/link';

type NeonProps = {
  category: any;
  className?: string;
  catalog: string;
  catalogName?: string;
};

const Neon: React.FC<NeonProps> = ({
  category,
  className,
  catalog,
  catalogName,
}) => {
  const { t } = useTranslation('common');

  const { id, name, image } = category ?? {};

  return (
    <header>
      <Link href={`/${catalog}/categories/${id}`}>
        <article
          className={cn(
            'product-card cart-type-neon h-full transform overflow-hidden rounded border border-border-200 bg-light shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow',
            className
          )}
        >
          <div className="relative flex h-48 w-auto items-center justify-center sm:h-64">
            <span className="sr-only">{t('text-product-image')}</span>
            <Image
              src={image?.original ?? productPlaceholder}
              alt={name}
              layout="fill"
              objectFit="contain"
              className="product-image"
            />
          </div>
          {/* End of product image */}
          {catalogName && (
            <div className="absolute top-4 left-4 rounded bg-orange-500 py-1 px-2 text-xs text-white">
              {catalogName}
            </div>
          )}
          <div className="p-3 md:p-6">
            {t('text-view')}
            <h2 className="mb-4 truncate text-xs text-body md:text-sm">
              {name}
            </h2>
          </div>
        </article>
      </Link>
    </header>
  );
};

export default Neon;
