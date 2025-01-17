import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import { useCreateUserGroupMutation } from "@data/user-group/use-user-group-create.mutation";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { userGroupValidationSchema } from "./user-group-validation-schema";
import { Permission } from "@ts-types/generated";


type FormValues = {
  BuyerID:string;
  Name: string;
  Description?: string;
  shop_id?: any;
};

const defaultValues = {
  BuyerID:"",
  Name: "",
  Description: "",
};

const UserGroupCreateForm = () => {
  const { t } = useTranslation();
  const { mutate: createUserGroup, isLoading: loading } =
    useCreateUserGroupMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(userGroupValidationSchema),
    defaultValues,
  });

  async function onSubmit({ BuyerID, Name, Description }: FormValues) {
    createUserGroup(
      {
        variables: { BuyerID, Name, Description },
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
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t("UserGroup")}
          details={t("Add your User information and create a new usergroup from here")}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
            label={t("Buyer ID")}
            {...register("BuyerID")}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.BuyerID?.message!)}
          />
          <Input
            label={t("form:input-label-name")}
            {...register("Name")}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.Name?.message!)}
          />
          <Input
            label={t("form:input-label-description")}
            {...register("Description")}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.Description?.message!)}
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={loading} disabled={loading}>
          {t("Create Usergroup")}
        </Button>
      </div>
    </form>
  );
};

export default UserGroupCreateForm;
