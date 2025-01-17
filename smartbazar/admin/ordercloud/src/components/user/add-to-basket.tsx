import { Form } from '@components/ui/form/form';
import Button from '@components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@components/ui/modal/modal.context';
import Input from '@components/ui/input';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useCart } from '@contexts/quick-cart/cart.context';

type FormValues = {
  quantity: number;
};
const addPointsValidationSchema = Yup.object().shape({
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .positive('Quantity be positive')
    .required('You must need to set quantity'),
});
const UserWalletPointsAddView = () => {
  const { t } = useTranslation();
  const { addItemToCart } = useCart();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function onSubmit({ quantity }: FormValues) {
    addItemToCart(
      {
        id: data.id,
        price: data.price,
        name: data.name,
        unit: data.unit,
      },
      quantity
    );
    closeModal();
  }

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      validationSchema={addPointsValidationSchema}
    >
      {({ register, formState: { errors } }) => (
        <div className="m-auto flex w-full max-w-sm flex-col rounded bg-light p-5 sm:w-[24rem]">
          <Input
            label={t('form:input-label-add-to-basket-quantity')}
            {...register('quantity')}
            defaultValue={1}
            variant="outline"
            className="mb-4"
            type="number"
            error={t(errors.quantity?.message!)}
          />
          <Button type="submit" className="ms-auto">
            {t('form:button-label-submit')}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default UserWalletPointsAddView;
