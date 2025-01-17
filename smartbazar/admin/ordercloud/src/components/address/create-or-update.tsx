import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import AddressForm from "@components/address/address-form";
import { AddressType } from "@ts-types/generated";
import { useUpdateUserMutation } from "@data/user/use-user-update.mutation";
import { useState } from "react";
import Cookies from "js-cookie";
import Axios from "axios";
import apiClient from "@utils/api/impersonation";

type FormValues = {
  __typename?: string;
  title: string;
  type: AddressType;
  address: {
    country: string;
    city: string;
    state: string;
    zip: string;
    street_address: string;
  };
};
const ORDERCLOUD_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT_ORDERCLOUD;
const CreateOrUpdateAddressForm = () => {
  const {
    data: { customerId, address },
  } = useModalState();
  const { closeModal } = useModalAction();
  const { mutate: updateProfile } = useUpdateUserMutation();
 

  function onSubmit(values: FormValues) {
    const { __typename, ...rest } = values;
    const orderId = Cookies.get('OrderId')
    const payload = {
      Address: {
        Street1: rest.address.street_address,
        City: rest.address.city,
        State: rest.address.state,
        Zip: rest.address.zip,
        Country: rest.address.country,
      },
    };

  
    try {
      const response = async (payload:any) => {
      
        const apiUrl = `${ORDERCLOUD_API_ENDPOINT}/v1/orders/Outgoing/${orderId}/billto`;
        try {
          console.log("API URL:", apiUrl);
          console.log("Payload:", apiUrl);
          const response = await apiClient.post(apiUrl, payload);
          console.log("API Response:", response.data);
          return response.data;
        } catch (error) {
          console.error("Error in addLineItemsToOrder:", error);
          throw error;
        }
      }
  
     
  
      // Close the modal
      closeModal();
    } catch (error) {
      console.error("Failed to update billing address:", error);
    }

    updateProfile({
      variables: {
        id: customerId,
        input: {
          address: [
            {
              ...(address?.id ? { id: address.id } : {}),
              ...rest,
            },
          ],
        },
      },
    });
    return closeModal();
  }
  return <AddressForm onSubmit={onSubmit} />;
};

export default CreateOrUpdateAddressForm;
