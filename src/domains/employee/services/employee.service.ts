import { keys_constants } from "@/utils/keys";
import { IEmployee, IGetAllEmployeesResponse } from "../models/employee";

const CONTROLLER_ENDPOINT = "/Employee";
const ENDPOINTS = {
  GET_ALL_EMPLOYEES: "/GetAllEmployees",
  DELETE_EMPLOYEE: "/DeleteEmployee",
  GET_EMPLOYEE_BY_NAME: "/GetEmployeeByName",
  ADD_EMPLOYEE: "/AddEmployee",
  UPDATE_EMPLOYEE: "/UpdateEmployee",
};

const buildUrl = (endpoint: string) =>
  `${keys_constants.web_api_key}${CONTROLLER_ENDPOINT}${endpoint}`;

export const EmployeeService = {
  /**
   * Fetches all employees data from the API.
   * @returns {Promise<IGetAllEmployeesResponse>} Employee data as an Employee instance
   * @throws Will throw an error if the fetch operation fails
   */
  getAll: async (): Promise<IGetAllEmployeesResponse> => {
    try {
      const response = await fetch(buildUrl(ENDPOINTS.GET_ALL_EMPLOYEES));
      //   console.log(response);
      // Check if the response is OK
      //   if (!response.ok) {
      //     throw new Error(`Failed to fetch employees: ${response.statusText}`);
      //   }

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },
  /**
   * Delete all employees data from the database.
   * @returns {Promise<BaseApiResponse>} Base response data
   * @throws Will throw an error if the fetch operation fails
   */
  delete: async (employeeId: string) => {
    console.log("deleteEmployee", employeeId);
    try {
      const response = await fetch(
        buildUrl(`${ENDPOINTS.DELETE_EMPLOYEE}/${employeeId}`),
        { method: "DELETE" }
      );
      console.log(response);
      // Check if the response is OK
      //   if (!response.ok) {
      //     throw new Error(`Failed to fetch employees: ${response.statusText}`);
      //   }

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  /**
   * Get employee by name.
   * @returns {Promise<IGetAllEmployeesResponse>} Employee data as an Employee instance
   * @throws Will throw an error if the fetch operation fails
   */
  getByName: async (name: string) => {
    console.log("searching", name);
    try {
      const response = await fetch(
        buildUrl(`${ENDPOINTS.GET_EMPLOYEE_BY_NAME}`),

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Name: name }),
        }
      );
      console.log(response);

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`Failed to fetch employee(s): ${response.statusText}`);
      }

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (error) {
      console.error("Error getting employee by name:", error);
      throw error;
    }
  },

  /**
   * Create employee.
   * @returns {Promise<BaseApiResponse>} Base response data
   * @throws Will throw an error if the fetch operation fails
   */
  createEmployee: async (request: IEmployee) => {
    console.log("creating", request);
    const req = JSON.stringify(request);
    console.log("req", req);

    try {
      const response = await fetch(buildUrl(`${ENDPOINTS.ADD_EMPLOYEE}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: req,
      });
      console.log(response);

      // Check if the response is OK
      // if (!response.ok) {
      //   throw new Error(`Failed to add employee(s): ${response.statusText}`);
      //   return null;
      // }

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (error) {
      console.error("Error creating employee:", error);
      return null;
      throw error;
    }
  },

  /**
   * Update employee.
   * @returns {Promise<BaseApiResponse>} Base response data
   * @throws Will throw an error if the fetch operation fails
   */
  updateEmployee: async (request: IEmployee) => {
    console.log("Updating", request);
    const req = {
      ...request,
      status: request.status,
      employeeContractType: request.employeeContractType,
    };
    console.log("req", req);

    const response = await fetch(buildUrl(`${ENDPOINTS.UPDATE_EMPLOYEE}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    try {
      console.log(response);

      // Check if the response is OK
      if (!response.ok) {
        Error(`Failed to add employee(s): ${response.statusText}`);
        return response.json();
      }

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (error) {
      console.error("Error creating employee:", error);
      return response.json();
      throw error;
    }
  },
};
