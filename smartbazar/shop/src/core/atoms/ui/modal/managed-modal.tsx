import dynamic from 'next/dynamic';
import Modal from '@/core/atoms/ui/modal/modal';
import { useModalAction, useModalState } from './modal.context';
const OtpLoginView = dynamic(() => import('@/core/atoms/auth/otp-login'));
const Login = dynamic(() => import('@/core/atoms/auth/login-form'), {
  ssr: false,
});
const Register = dynamic(() => import('@/core/atoms/auth/register-form'));
const ForgotPassword = dynamic(
  () => import('@/core/atoms/auth/forgot-password')
);
const ProductDetailsModalView = dynamic(
  () => import('@/core/atoms/products/details/popup'),
  { ssr: false }
);
const ShopInfoCard = dynamic(() => import('@/core/atoms/shops/sidebar'));
const CreateOrUpdateAddressForm = dynamic(
  () => import('@/core/atoms/address/address-form'),
  { ssr: false }
);
const CreateOrUpdateGuestAddressForm = dynamic(
  () => import('@/core/atoms/checkout/create-or-update-guest')
);
const AddressDeleteView = dynamic(
  () => import('@/core/atoms/address/delete-view')
);
const AddOrUpdateCheckoutContact = dynamic(
  () => import('@/core/atoms/checkout/contact/add-or-update')
);
const ProfileAddOrUpdateContact = dynamic(
  () => import('@/core/atoms/profile/profile-add-or-update-contact')
);
const CreateRefundView = dynamic(
  () => import('@/core/atoms/refunds/refund-form')
);
const CartMerge = dynamic(() => import('@/core/atoms/cart/cart-merge'));

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {view === 'LOGIN_VIEW' && <Login />}
      {view === 'CART_MERGE' && <CartMerge />}
      {view === 'REGISTER' && <Register />}
      {view === 'FORGOT_VIEW' && <ForgotPassword />}
      {view === 'OTP_LOGIN' && <OtpLoginView />}
      {view === 'REFUND_REQUEST' && <CreateRefundView />}
      {view === 'ADD_OR_UPDATE_ADDRESS' && <CreateOrUpdateAddressForm />}
      {view === 'ADD_OR_UPDATE_GUEST_ADDRESS' && (
        <CreateOrUpdateGuestAddressForm />
      )}
      {view === 'ADD_OR_UPDATE_CHECKOUT_CONTACT' && (
        <AddOrUpdateCheckoutContact />
      )}
      {view === 'ADD_OR_UPDATE_PROFILE_CONTACT' && (
        <ProfileAddOrUpdateContact />
      )}
      {view === 'DELETE_ADDRESS' && <AddressDeleteView />}
      {view === 'PRODUCT_DETAILS' && (
        <ProductDetailsModalView productSlug={data} />
      )}
      {view === 'SHOP_INFO' && (
        <ShopInfoCard
          shop={data?.shop}
          cardClassName="!hidden"
          className="!flex !h-screen !w-screen max-w-screen-sm flex-col"
        />
      )}
    </Modal>
  );
};

export default ManagedModal;
