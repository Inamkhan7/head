import { Controller } from 'react-hook-form';
import Button from '@/core/atoms/ui/button';
import Input from '@/core/atoms/ui/forms/input';
import Label from '@/core/atoms/ui/forms/label';
import Radio from '@/core/atoms/ui/forms/radio/radio';
import TextArea from '@/core/atoms/ui/forms/text-area';
import PhoneInput from '@/core/atoms/ui/forms/phone-input';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { useModalState } from '@/core/atoms/ui/modal/modal.context';
import { Form } from '@/core/atoms/ui/forms/form';
import { AddressType } from '@/framework/utils/constants';
import { useUpdateUserAddress } from '@/framework/user';

type FormValues = {
  title: string;
  type: AddressType;
  address: {
    country: string;
    city: string;
    state: string;
    zip: string;
    street_address: string;
    phone: string;
  };
};

const addressSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf([AddressType.Billing, AddressType.Shipping])
    .required('error-type-required'),
  title: yup.string().required('error-title-required'),
  address: yup.object().shape({
    country: yup.string().required('error-country-required'),
    city: yup.string().required('error-city-required'),
    state: yup.string().required('error-state-required'),
    zip: yup.string().required('error-zip-required'),
    street_address: yup.string().required('error-street-required'),
    phone: yup.string().required('error-contact-required'),
  }),
});

export const AddressForm: React.FC<any> = ({
  onSubmit,
  defaultValues,
  isLoading,
}) => {
  const { t } = useTranslation('common');

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      className="grid h-full grid-cols-2 gap-5"
      //@ts-ignore
      validationSchema={addressSchema}
      useFormProps={{
        shouldUnregister: true,
        defaultValues,
      }}
      resetValues={defaultValues}
    >
      {({ control, register, formState: { errors } }) => (
        <>
          <div>
            <Label>{t('text-type')}</Label>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Radio
                id="billing"
                {...register('type')}
                type="radio"
                value={AddressType.Billing}
                label={t('text-billing')}
              />
              <Radio
                id="shipping"
                {...register('type')}
                type="radio"
                value={AddressType.Shipping}
                label={t('text-shipping')}
              />
            </div>
          </div>

          <Input
            label={t('text-title')}
            {...register('title')}
            error={t(errors.title?.message!)}
            variant="outline"
            className="col-span-2"
          />

          <div className="col-span-2">
            <Label>{t('text-contact-number')}</Label>
            <Controller
              name="address.phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country="us"
                  inputClass="!p-0 ltr:!pr-4 rtl:!pl-4 ltr:!pl-14 rtl:!pr-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-border-base rtl:!border-l-0 focus:!border-accent !h-12"
                  dropdownClass="focus:!ring-0 !border !border-border-base !shadow-350"
                  {...field}
                />
              )}
            />
          </div>

          <Input
            label={t('text-country')}
            {...register('address.country')}
            error={t(errors.address?.country?.message!)}
            variant="outline"
          />

          <Input
            label={t('text-city')}
            {...register('address.city')}
            error={t(errors.address?.city?.message!)}
            variant="outline"
          />

          <Input
            label={t('text-state')}
            {...register('address.state')}
            error={t(errors.address?.state?.message!)}
            variant="outline"
          />

          <Input
            label={t('text-zip')}
            {...register('address.zip')}
            error={t(errors.address?.zip?.message!)}
            variant="outline"
          />

          <TextArea
            label={t('text-street-address')}
            {...register('address.street_address')}
            error={t(errors.address?.street_address?.message!)}
            variant="outline"
            className="col-span-2"
          />

          <Button
            className="col-span-2 w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {Boolean(defaultValues) ? t('text-update') : t('text-save')}{' '}
            {t('text-address')}
          </Button>
        </>
      )}
    </Form>
  );
};

export default function CreateOrUpdateAddressForm() {
  const { t } = useTranslation('common');
  const {
    data: { customerId, address, type },
  } = useModalState();
  const { mutate: saveAddress } = useUpdateUserAddress();

  function onSubmit(values: FormValues) {
    const formattedInput = {
      id: address?.id,
      title: values.title,
      type: values.type,
      address: {
        ...values.address,
      },
    };
    saveAddress(formattedInput);
  }
  return (
    <div className="min-h-screen bg-light p-5 sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-4 text-center text-lg font-semibold text-heading sm:mb-6">
        {address ? t('text-update') : t('text-add-new')} {t('text-address')}
      </h1>
      <AddressForm
        onSubmit={onSubmit}
        defaultValues={{
          title: address?.title ?? '',
          type: address?.type ?? type,
          address: {
            ...address?.address,
          },
        }}
      />
    </div>
  );
}
