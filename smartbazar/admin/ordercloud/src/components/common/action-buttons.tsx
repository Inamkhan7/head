import { BanUser } from '@components/icons/ban-user';
import EditIcon from '@components/icons/edit';
import Trash from '@components/icons/trash';
import { Eye } from '@components/icons/eye-icon';
import { WalletPointsIcon } from '@components/icons/wallet-point';
import Link from '@components/ui/link';
import Cart from '@components/icons/cart';
import { useTranslation } from 'next-i18next';
import { CheckMarkCircle } from '@components/icons/checkmark-circle';
import { useModalAction } from '@components/ui/modal/modal.context';
import { CloseFillIcon } from '@components/icons/close-fill';
import { AdminIcon } from '@components/icons/admin-icon';
import React from 'react';
import { UploadIcon } from '@components/icons/upload-icon';

type Props = {
  id: string;
  deleteModalView?: string | any;
  editUrl?: string;
  detailsUrl?: string;
  isUserActive?: boolean;
  userStatus?: boolean;
  isShopActive?: boolean;
  approveButton?: boolean;
  showAddWalletPoints?: boolean;
  changeRefundStatus?: boolean;
  showMakeAdminButton?: boolean;
  showAddToBasket?: boolean;
  item?: any;
};

const ActionButtons = React.memo(
  ({
    id,
    deleteModalView,
    editUrl,
    detailsUrl,
    userStatus = false,
    isUserActive = false,
    isShopActive,
    approveButton = false,
    showAddWalletPoints = false,
    changeRefundStatus = false,
    showMakeAdminButton = false,
    showAddToBasket = false,
    item,
  }: Props) => {
    const { t } = useTranslation();
    const { openModal } = useModalAction();
    function handleUploadToIndex()
    {

    }
    function handleDelete() {
      openModal(deleteModalView, item);
    }
    function handleUserStatus(type: string) {
      openModal('BAN_CUSTOMER', { id, type });
    }
    function handleAddWalletPoints() {
      openModal('ADD_WALLET_POINTS', id);
    }
    function handleMakeAdmin() {
      openModal('MAKE_ADMIN', id);
    }
    function handleUpdateRefundStatus() {
      openModal('UPDATE_REFUND', id);
    }
    function handleAddToBasket() {
      openModal('ADD_TO_BASKET', item);
    }
    function handleShopStatus(status: boolean) {
      if (status === true) {
        openModal('SHOP_APPROVE_VIEW', id);
      } else {
        openModal('SHOP_DISAPPROVE_VIEW', id);
      }
    }
    return (
      <div className="inline-flex w-auto items-center space-s-5">
        {showMakeAdminButton && (
          <button
            onClick={handleMakeAdmin}
            className="focus:outline-none text-accent transition duration-200 hover:text-accent-hover"
            title={t('common:text-make-admin')}
          >
            <AdminIcon width={18} />
          </button>
        )}
        {showAddWalletPoints && (
          <button
            onClick={handleAddWalletPoints}
            className="focus:outline-none text-accent transition duration-200 hover:text-accent-hover"
            title={t('common:text-add-wallet-points')}
          >
            <WalletPointsIcon width={22} />
          </button>
        )}
        {showAddToBasket && (
          <button
            onClick={handleAddToBasket}
            className="focus:outline-none text-accent transition duration-200 hover:text-accent-hover"
            title={t('common:text-change-refund-status')}
          >
            <Cart width={20} />
          </button>
        )}
        {changeRefundStatus && (
          <button
            onClick={handleUpdateRefundStatus}
            className="focus:outline-none text-accent transition duration-200 hover:text-accent-hover"
            title={t('common:text-change-refund-status')}
          >
            <CheckMarkCircle width={20} />
          </button>
        )}
        {approveButton &&
          (!isShopActive ? (
            <button
              onClick={() => handleShopStatus(true)}
              className="focus:outline-none text-accent transition duration-200 hover:text-accent-hover"
              title={t('common:text-approve-shop')}
            >
              <CheckMarkCircle width={20} />
            </button>
          ) : (
            <button
              onClick={() => handleShopStatus(false)}
              className="focus:outline-none text-red-500 transition duration-200 hover:text-red-600"
              title={t('common:text-disapprove-shop')}
            >
              <CloseFillIcon width={20} />
            </button>
          ))}
        {userStatus && (
          <>
            {isUserActive ? (
              <button
                onClick={() => handleUserStatus('ban')}
                className="focus:outline-none text-red-500 transition duration-200 hover:text-red-600"
                title={t('common:text-ban-user')}
              >
                <BanUser width={20} />
              </button>
            ) : (
              <button
                onClick={() => handleUserStatus('active')}
                className="focus:outline-none text-accent transition duration-200 hover:text-accent"
                title={t('common:text-activate-user')}
              >
                <CheckMarkCircle width={20} />
              </button>
            )}
          </>
        )}

        {editUrl && (
          <Link
            href={editUrl}
            className="text-base transition duration-200 hover:text-heading"
            title={t('common:text-edit')}
          >
            <EditIcon width={16} />
          </Link>
        )}
        {deleteModalView && (
          <button
            onClick={handleDelete}
            className="focus:outline-none text-red-500 transition duration-200 hover:text-red-600"
            title={t('common:text-delete')}
          >
            <Trash width={16} />
          </button>
        )}
        {detailsUrl && (
          <Link
            href={detailsUrl}
            className="ml-2 text-base transition duration-200 hover:text-heading"
            title={t('common:text-view')}
          >
            <Eye width={24} />
          </Link>
        )}
        {(
          <button
            onClick={handleUploadToIndex}
            className="focus:outline-none text-red-500 transition duration-200 hover:text-red-600"
            title={t('common:text-push-to-index')}
          >
            <UploadIcon />
          </button>
        )}
      </div>
    );
  }
);

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
