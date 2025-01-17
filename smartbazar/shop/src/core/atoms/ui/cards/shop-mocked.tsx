import Image from 'next/image';
import Link from '@/core/atoms/ui/link';
import { productPlaceholder } from '@/lib/placeholders';

type ShopCardProps = {
  url: string;
  name: string;
  logo: {
    thumbnail: string;
  };
  description: string;
};

const ShopCard: React.FC<ShopCardProps> = (props) => {
  return (
    <Link href={props.url}>
      <div className="relative flex cursor-pointer items-center rounded border border-gray-200 p-5">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <Image
            alt={props.name}
            src={props.logo?.thumbnail ?? productPlaceholder}
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="ml-4 flex flex-col">
          <span className="mb-2 text-lg font-semibold text-heading">
            {props?.name}
          </span>
          <span className="flex text-xs text-body">{props?.description}</span>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
