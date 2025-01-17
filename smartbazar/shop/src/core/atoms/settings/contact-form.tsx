import type { CreateContactUsInput } from '@/types';
import Button from '@/core/atoms/ui/button';
import { Form } from '@/core/atoms/ui/forms/form';
import Input from '@/core/atoms/ui/forms/input';
import TextArea from '@/core/atoms/ui/forms/text-area';
import { useContact } from '@/framework/user';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';

const contactFormSchema = yup.object().shape({
  name: yup.string().required('error-name-required'),
  email: yup
    .string()
    .email('error-email-format')
    .required('error-email-required'),
  subject: yup.string().required('error-subject-required'),
  description: yup.string().required('error-description-required'),
});
const ContactForm = () => {
  const { t } = useTranslation('common');
  const { mutate, isLoading } = useContact();

  function onSubmit(values: CreateContactUsInput) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "click",
      loginStatus: "out",
      pageArea: "pub",
      pageItem: "Contact Us",
      pageSection: "Contact Us Form",
      pageType: "Lead Form",
      clickType: "Submit",
      memberId: "XXX",
      visitor: "AAA",
      Name: values.name,
      Email: values.email, 
      Subject: values.subject,
      Description: values.description,

    });
    mutate(values);
  }

  return (
    <Form<CreateContactUsInput>
      onSubmit={onSubmit}
      validationSchema={contactFormSchema}
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label={t('text-name')}
              {...register('name')}
              variant="outline"
              error={t(errors.name?.message!)}
            />
            <Input
              label={t('text-email')}
              {...register('email')}
              type="email"
              variant="outline"
              error={t(errors.email?.message!)}
            />
          </div>
          <Input
            label={t('text-subject')}
            {...register('subject')}
            variant="outline"
            className="my-6"
            error={t(errors.subject?.message!)}
          />
          <TextArea
            label={t('text-description')}
            {...register('description')}
            variant="outline"
            className="my-6"
            error={t(errors.description?.message!)}
          />

          <Button loading={isLoading} disabled={isLoading}>
            {t('text-submit')}
          </Button>
        </>
      )}
    </Form>
  );
};

export default ContactForm;
