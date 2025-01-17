import {
  BuyerInput,
	CreateBuyer, UpdateBuyer
} from "@ts-types/custom.types";
import Base from "./base";

class Buyer extends Base<CreateBuyer, UpdateBuyer> {
  createBuyer = async (url: string, variables: BuyerInput) => {
    return this.http<BuyerInput>(url, "post", variables);
  };
  updateBuyer = async (url: string, variables: BuyerInput) => {
    return this.http<BuyerInput>(url, "put", variables);
  };
}

export default new Buyer();
