import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { Image } from '@/core/atoms/ui/image';
import noResult from '@/assets/no-result.svg';
interface Props {
  text?: string;
  className?: string;
}

const NotFound: React.FC<Props> = ({ className, text }) => {
  const { t } = useTranslation('common');
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="flex h-full w-full items-center justify-center">
        <Image
          src={noResult}
          alt={text ? t(text) : t('text-no-result-found')}
          className="h-full w-full object-contain"
        />
      </div>
      {text && (
        <h3 className="my-7 w-full text-center text-xl font-semibold text-body">
          {t(text)}
        </h3>
      )}
    </div>
  );
};

export default NotFound;
