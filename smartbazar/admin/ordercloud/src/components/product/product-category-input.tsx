import SelectInput from "@components/ui/select-input";
import Label from "@components/ui/label";
import { Control, useFormState, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useCategoriesQuery } from "@data/category/use-categories.query";
import { useTranslation } from "next-i18next";
import { Category } from "@ts-types/generated";

interface Props {
  control: Control<any>;
  setValue: any;
}

const ProductCategoryInput = ({ control, setValue }: Props) => {
  const { t } = useTranslation("common");
  const type = useWatch({
    control,
    name: "type",
  });
  const { dirtyFields } = useFormState({
    control,
  });
  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue("categories", []);
    }
  }, [type?.slug]);

  const { data, isLoading: loading } = useCategoriesQuery({
    limit: 100,
    type: type?.slug,
    parent: type?.slug,
  });

  const options = useMemo(
    () =>
      data?.categories.data.reduce((ops: Category[], cat: Category) => {
        if (cat.children?.length) {
          return [...ops, cat, ...cat.children];
        }
        return [...ops, cat];
      }, []),
    [data]
  );

  return (
    <div className="mb-5">
      <Label>{t("form:input-label-categories")}</Label>
      <SelectInput
        name="categories"
        isMulti
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        // @ts-ignore
        options={options}
        isLoading={loading}
      />
    </div>
  );
};

export default ProductCategoryInput;
