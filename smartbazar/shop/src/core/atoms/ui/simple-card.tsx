import cn from 'classnames';
import Image from 'next/image';
import Button from '@/core/atoms/ui/button';
import Link from 'next/link';

interface AuthorItemProps {
  item: any;
}

const SimpleCard: React.FC<AuthorItemProps> = ({ item }) => {
  return (
    <div
      className={cn(
        'bg-white-100 relative flex w-full  flex-col overflow-hidden border-solid'
      )}
    >
      <Image
        src={item.image.original}
        width={item.image.width || 500}
        height={item.image.height || 500}
        alt=""
      />
      {item.name && (
        <h1 className="text pb-6 text-3xl font-semibold text-heading">
          {item.name}
        </h1>
      )}
      {item.link && (
        <Link href={(item?.link?.href as string) || '#'}>
          <a className="focus:ring-accent-800 inline-flex h-10 w-40 shrink-0 items-center justify-center rounded border border-transparent bg-gray-700 text-sm font-semibold leading-none text-white outline-none transition duration-300 ease-in-out focus:shadow focus:outline-none focus:ring-1 md:text-base">
            {item?.link?.text}
          </a>
        </Link>
      )}
      {/* <p className="flex text-xm text-body pb-4">
        {item.description}
        </p> */}
    </div>
  );
};

export default SimpleCard;
