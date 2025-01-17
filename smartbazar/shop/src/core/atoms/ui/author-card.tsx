import cn from 'classnames';
import { avatarPlaceholder } from '@/lib/placeholders';
import { Image } from '@/core/atoms/ui/image';
import Link from '@/core/atoms/ui/link';
import { ROUTES } from '@/lib/routes';

interface AuthorItemProps {
  item: any;
}

const AuthorCard: React.FC<AuthorItemProps> = ({ item }) => (
  <Link
    href={`${ROUTES.AUTHORS}/${item?.slug}`}
    className={cn(
      'group relative flex cursor-pointer flex-col items-center bg-light text-center'
    )}
  >
    <span
      className={cn(
        'relative mb-6 flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-350'
      )}
    >
      <Image
        src={item?.image?.original! ?? avatarPlaceholder}
        alt={item?.name!}
        layout="fill"
        objectFit="contain"
      />
    </span>
    <span className="block text-center font-semibold text-heading transition-colors group-hover:text-orange-500">
      {item.name}
    </span>
  </Link>
);

export default AuthorCard;
