import ConfirmationCard from '@/core/atoms/ui/cards/confirmation';
import {
  useModalAction,
  useModalState,
} from '@/core/atoms/ui/modal/modal.context';
import { useDeleteAddress } from '@/framework/user';

export default function AddressDeleteView() {
  const {
    data: { addressId },
  } = useModalState();
  const { closeModal } = useModalAction();
  const { mutate: deleteAddressById, isLoading } = useDeleteAddress();

  function handleDelete() {
    if (!addressId) {
      return;
    }
    deleteAddressById({ id: addressId });
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={isLoading}
    />
  );
}
