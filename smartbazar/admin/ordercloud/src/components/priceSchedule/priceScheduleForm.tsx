import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreatePriceScheduleMutation } from "@data/price-schedule/price-schedule-create.mutation";
import { CreatePriceScheduleInput } from "@ts-types/generated";

type PriceBreak = {
  Quantity: number;
  Price: number;
};

type FormValues = {
  ID: string;
  Name: string;
  MinQuantity: number;
  PriceBreaks: PriceBreak[];
};

const priceScheduleValidationSchema = yup.object().shape({
  ID: yup.string().required("ID is required"),
  Name: yup.string().required("Name is required"),
  MinQuantity: yup.number().min(1, "Min Quantity must be at least 1").required(),
  PriceBreaks: yup.array().of(
    yup.object().shape({
      Quantity: yup.number().min(1, "Quantity must be at least 1").required(),
      Price: yup.number().min(0, "Price must be at least 0").required(),
    })
  ),
});

const defaultValues: FormValues = {
  ID: "",
  Name: "",
  MinQuantity: 1,
  PriceBreaks: [{ Quantity: 1, Price: 0 }],
};

const PriceScheduleForm = () => {
  const { t } = useTranslation();
   const { mutate: createPriceSchedule, isLoading: loading } =
   useCreatePriceScheduleMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(priceScheduleValidationSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "PriceBreaks",
  });

async function onSubmit(data: FormValues) {
    try {
      const priceScheduleData: CreatePriceScheduleInput = {
        ID: data.ID,
        Name: data.Name,
        MinQuantity: data.MinQuantity,
        PriceBreaks: data.PriceBreaks,
      };

      await createPriceSchedule({
        variables: priceScheduleData,
      });
    } catch (error) {
    }
  }
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t("Price Schedule")}
          details={t(
            "Add the price schedule details and configure price breaks from here."
          )}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t("ID")}
            {...register("ID")}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.ID?.message!)}
          />
          <Input
            label={t("Name")}
            {...register("Name")}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.Name?.message!)}
          />
          <Input
            label={t("Min Quantity")}
            {...register("MinQuantity")}
            type="number"
            variant="outline"
            className="mb-4"
            error={t(errors.MinQuantity?.message!)}
          />

          <div>
            <h4 className="mb-4">{t("Price Breaks")}</h4>
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-4 mb-4 items-end">
                <Input
                  label={t("Quantity")}
                  {...register(`PriceBreaks.${index}.Quantity` as const)}
                  type="number"
                  variant="outline"
                  error={t(errors.PriceBreaks?.[index]?.Quantity?.message!)}
                />
                <Input
                  label={t("Price")}
                  {...register(`PriceBreaks.${index}.Price` as const)}
                  type="number"
                  variant="outline"
                  error={t(errors.PriceBreaks?.[index]?.Price?.message!)}
                />
                <Button type="button" onClick={() => remove(index)}>
                  {t("Remove")}
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ Quantity: 1, Price: 0 })}>
              {t("Add Price Break")}
            </Button>
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button type="submit">{t("Create Price Schedule")}</Button>
      </div>
    </form>
  );
};

export default PriceScheduleForm;
