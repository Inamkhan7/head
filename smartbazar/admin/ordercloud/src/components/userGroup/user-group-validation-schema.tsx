import * as yup from "yup";

export const userGroupValidationSchema = yup.object().shape({
  BuyerID: yup.string().required("BuyerID is required").min(3, "Name must be at least 3 characters"),
  Name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  Description: yup.string().optional(),
});
