import cn from 'classnames';
import { useEffect } from 'react';
import { Image } from '@/core/atoms/ui/image';
import Link from '@/core/atoms/ui/link';
import { logoPlaceholder } from '@/lib/placeholders';
import { useSettings } from '@/framework/settings';
import useCatalog from '@/lib/use-catalog';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({ className }) => {
  const { queryCatalog, saveCatalog } = useCatalog();
  const { settings } = useSettings();

  useEffect(() => {
    if (queryCatalog) {
      saveCatalog(queryCatalog);
    }
  }, []);

  return (
    <Link
      href={
        settings?.homeUrl ? `/${settings?.homeUrl}`.replace('//', '/') : '/'
      }
      className={cn('inline-flex', className)}
    >
      <span className="relative h-10 w-32 overflow-hidden md:w-40">
        <Image
          src={settings?.logo?.original ?? logoPlaceholder}
          alt={(settings?.siteTitle as string) || 'Smart Bazaar'}
          layout="fill"
          objectFit="contain"
          loading="eager"
        />
      </span>
    </Link>
  );
};

export default Logo;
