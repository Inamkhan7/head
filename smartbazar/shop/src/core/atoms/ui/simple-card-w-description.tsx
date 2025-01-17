import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

interface AuthorItemProps {
  item: any;
}

const SimpleCardDescription: React.FC<AuthorItemProps> = ({ item }) => {
  const style = {
    backgroundImage: `url(${item.image.original})`,
  };

  return (
    <div>
      <div
        className={cn(
          'bg-white-100 h-100 relative flex w-full flex-col overflow-hidden border-solid bg-white bg-cover bg-no-repeat text-heading'
        )}
      >
        <Image
          src={item.image.original}
          alt={item.image.alt}
          className="h-100"
          width={item.image.width}
          height={item.image.height}
        />
      </div>

      <div
        className={cn(
          'bg-white-100 h-100 relative flex w-full flex-col overflow-hidden border-solid bg-white bg-cover bg-no-repeat p-4 text-heading'
        )}
      >
        <h1 className="text pb-6 text-3xl font-semibold">{item?.name}</h1>
        <Link href={(item?.link?.href as string) || '#'}>
          <a className="focus:ring-accent-800 inline-flex h-10 w-40 shrink-0 items-center justify-center rounded border border-transparent bg-gray-700 text-sm font-semibold leading-none text-white outline-none transition duration-300 ease-in-out focus:shadow focus:outline-none focus:ring-1 md:text-base">
            {item?.link?.text}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default SimpleCardDescription;
