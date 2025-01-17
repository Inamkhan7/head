import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import { useCreateBuyerMutation } from "@data/buyers/use-create-buyer-mutation";
import { useTranslation } from "next-i18next";
import { getBuyerDetails } from "./form-utils";
import Checkbox from "@components/ui/checkbox/checkbox";
import OrganizationCatalogInput from "./organization-catalog-input";

type FormValues = {
  id: string;
  name: string;
  organization: string;
  defaultCatalog: {
    id: string
  };
  active:boolean
};

const defaultValues = {
  id: "",
  name: "",
  defaultCatalog: "",
  active:false
};

type Form = {
  id: string,
  name:string,
  organization: string,
  defaultCatalog: {
    id: string
  },
  active: string
}

const getBuyerInputValues = (form: FormValues) => {
  return {
          id: form.id,
          name: form.name,
          defaultCatalog: form.defaultCatalog.id,
          active: form.active,
          organization:form.organization,
  }
}
const OrganizationForm = (initialValues: FormValues) => {
  const doesInitialValueExists = Object.keys(initialValues).length
    ? true
    : false;
  const { t } = useTranslation();

  const { mutate: registerBuyer, isLoading: loading } = useCreateBuyerMutation();
  // const { mutate: updateUser } = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: doesInitialValueExists
      ? getBuyerDetails(initialValues.initialValues.data)
      : defaultValues,
  });

  async function onSubmit(input: FormValues) {
    const inputValues = getBuyerInputValues(input);
    if (doesInitialValueExists) {
      // const inputValues = getUserInputValues(
      //   { id, name, catalogId },
      //   initialValues
      // );
      // updateUser(
      //   {
      //     variables: {
      //       id: initialValues.initialValues.data.ID,
      //       input: { ...inputValues },
      //     },
      //   },
      //   {
      //     onError: (error: any) => {
      //       Object.keys(error?.response?.data).forEach((field: any) => {
      //         setError(field, {
      //           type: "manual",
      //           message: error?.response?.data[field][0],
      //         });
      //       });
      //     },
      //   }
      // );
    } else {
      registerBuyer({
        variables: inputValues
        // {
        //   ID,
        //   Name,
        //   DefaultCatalogID: (DefaultCatalogID as { id: string }).id,
        //   Active,
        // },
      },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        });
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t("form:form-title-information")}
          details={t("form:customer-form-info-help-text")}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t("form:input-label-buyer-id")}
            {...register("id")}
            type="text"
            variant="outline"
            className="mb-4"
          />
          <Input
            label={t("form:input-label-buyer-name")}
            {...register("name")}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
          />
          <Input
            label={t("form:input-label-organization")}
            {...register("organization")}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
          />
          <OrganizationCatalogInput
                control={control}
                error={t((errors?.defaultCatalog as any)?.message)}
                setValue={setValue} />
          <Checkbox
            {...register('active')}
            error={t(errors.active?.message!)}
            label={t('form:input-label-active')}
            className="mb-5"
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={loading} disabled={loading}>
          {`${doesInitialValueExists
              ? t("form:form-title-update-customer")
              : t("form:button-label-create-organization")
            }`}
        </Button>
      </div>
    </form>
  );
};

export default OrganizationForm;
