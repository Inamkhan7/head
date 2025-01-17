import ConfirmationCard from "@components/common/confirmation-card";
import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import { useDeleteUserMutation } from "@data/user/user-delete.mutation";

const UserDeleteView = () => {
  const { mutate: deleteUser, isLoading: loading } = useDeleteUserMutation();
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  async function handleDelete() {
    deleteUser(data.id);
    closeModal();
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default UserDeleteView;
