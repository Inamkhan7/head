import { CloseIcon } from '@/core/atoms/icons/close-icon';
import { PencilIcon } from '@/core/atoms/icons/pencil-icon';
import { useModalAction } from '@/core/atoms/ui/modal/modal.context';
import { formatAddress } from '@/lib/format-address';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';

interface AddressProps {
  address: any;
  checked: boolean;
  onEdit: () => void;
  onDelete?: () => void;
}
const AddressCard: React.FC<AddressProps> = ({
  checked,
  address,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={classNames(
        'group relative cursor-pointer rounded border p-4 hover:border-accent',
        {
          'border-accent shadow-sm': checked,
          'border-transparent bg-gray-100': !checked,
        }
      )}
    >
      <p className="mb-3 text-sm font-semibold capitalize text-heading">
        {address?.title}
      </p>
      <p className="text-sm text-sub-heading">
        {formatAddress(address?.address)}
      </p>
      <div className="absolute top-4 flex space-x-2 opacity-0 group-hover:opacity-100 ltr:right-4 rtl:left-4 rtl:space-x-reverse">
        {onEdit && (
          <button
            className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-light"
            onClick={onEdit}
          >
            <span className="sr-only">{t('text-edit')}</span>
            <PencilIcon className="h-3 w-3" />
          </button>
        )}
        {onDelete && (
          <button
            className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-light"
            onClick={onDelete}
          >
            <span className="sr-only">{t('text-delete')}</span>
            <CloseIcon className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
