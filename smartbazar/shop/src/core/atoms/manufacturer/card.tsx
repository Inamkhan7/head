import cn from 'classnames';
import { avatarPlaceholder } from '@/lib/placeholders';
import { useTranslation } from 'next-i18next';
import { Image } from '@/core/atoms/ui/image';
import Link from '@/core/atoms/ui/link';
import { ROUTES } from '@/lib/routes';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { getIcon } from '@/lib/get-icon';
import * as socialIcons from '@/core/atoms/icons/social';

interface ManufacturerProps {
  item: any;
  className?: string;
}

const ManufacturerCard: React.FC<ManufacturerProps> = ({ item, className }) => {
  const { t } = useTranslation();

  return (
    <Link
      href={`${ROUTES.MANUFACTURERS}/${item?.slug}`}
      className={cn(
        'relative flex cursor-pointer items-center rounded border border-gray-200 bg-white p-5 shadow-md',
        className
      )}
      title={item?.name}
    >
      <span
        className={cn(
          'relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300'
        )}
      >
        <Image
          src={item?.image?.original! ?? avatarPlaceholder}
          alt={item?.name!}
          layout="fill"
          objectFit="cover"
        />
      </span>
      <div className="flex flex-col overflow-hidden ltr:ml-4 rtl:mr-4">
        <span className="mb-2 truncate text-lg font-semibold text-heading transition-colors hover:text-orange-500">
          {item?.name}
        </span>
        {!isEmpty(item?.socials) ? (
          <div className="mt-1.5 flex items-center space-x-3 ltr:ml-1 rtl:mr-1 rtl:space-x-reverse">
            {item?.socials?.map((item: any, index: number) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                className={`cursor-pointer text-body transition-colors duration-300 hover:text-accent focus:outline-none`}
                rel="noreferrer"
              >
                {getIcon({
                  iconList: socialIcons,
                  iconName: item.icon,
                  className: 'w-[16px] h-[14px]',
                })}
              </a>
            ))}
          </div>
        ) : (
          // <span className="text-xs text-body flex">
          //   {t('common:text-no-address')}
          // </span>
          <div className="mt-1.5 flex items-center space-x-3 rtl:space-x-reverse">
            <a
              href="/"
              target="_blank"
              className={`cursor-pointer text-body transition-colors duration-300 hover:text-accent focus:outline-none`}
              rel="noreferrer"
            >
              {getIcon({
                iconList: socialIcons,
                iconName: 'FacebookIcon',
                className: 'w-[16px] h-[14px]',
              })}
              {/* <FacebookIcon className="w-[16px] h-[14px]" /> */}
            </a>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ManufacturerCard;
