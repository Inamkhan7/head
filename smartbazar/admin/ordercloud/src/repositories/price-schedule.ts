import { CreatePriceScheduleInput, UpdatePriceScheduleInput } from "@ts-types/generated";
import http from "@utils/api/http";
import Base from "./base";

class PriceSchedule extends Base<CreatePriceScheduleInput, UpdatePriceScheduleInput> {
  // Create a new price schedule
  create = async (url: string, variables: CreatePriceScheduleInput) => {
    return this.http<CreatePriceScheduleInput>(url, "post", variables);
  };

  // Update an existing price schedule
  update = async (url: string, variables: UpdatePriceScheduleInput) => {
    return this.http<UpdatePriceScheduleInput>(url, "put", variables);
  };

  // Fetch all price schedules
  getAll = async (url: string) => {
    return this.http(url, "get");
  };

  // Fetch a specific price schedule by ID
  get = async (url: string, id: string) => {
    return this.http(`${url}/${id}`, "get");
  };

  // Delete a price schedule by ID
//   delete = async (url: string, id: string) => {
//     return this.http(`${url}/${id}`, "delete");
//   };
}

export default new PriceSchedule();
