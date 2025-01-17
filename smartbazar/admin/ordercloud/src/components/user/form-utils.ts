import { User } from "@ts-types/generated";

export function getUserDetails(user: User) {
  if (!Object.keys(user).length) {
    return {
      name: "",
      email: "",
      password: "",
    };
  }
  const userData = user;
  return {
    id: userData.ID,
    name: userData.FirstName,
    email: userData.Email,
    password: userData.Password,
  };
}

export function getUserInputValues(values: any, initialValues: any) {
  return {
    Username: values.email,
    FirstName: values.name,
    LastName: values.name,
    Email: values.email,
    Password: values.password,
  };
}
