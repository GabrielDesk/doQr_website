import { EContractType } from "@/domains/contractType/models/contractType";
import { BaseApiResponse } from "@/models/apisRespose.model";

export enum EStatus {
  Inactive = 0,
  Active = 1,
}

export interface IEmployee {
  [key: string]: string | number | undefined;
  employeeId?: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  employeeContractType: EContractType;
  status: EStatus;
}

export interface IGetAllEmployeesResponse extends BaseApiResponse {
  allEmployees: IEmployee[];
}
export interface DeleteEmployeeRequest {
  EmployeeId: string;
}
