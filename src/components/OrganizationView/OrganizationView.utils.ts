import axios from "axios";
import { Employee } from "./OrganizationView.types";

enum ENDPOINTS {
  EMPLOYEES = "http://api.additivasia.io/api/v1/assignment/employees/",
}

export function getInfo(employeeName: string) {
  let cached: { [x: string]: Promise<any> } = {};
  /**
   * resursively retrieve emplyee information.
   * @param employee
   */
  function recurse(employee: Employee) {
    const tangentialPromiseBranch: Promise<any> = axios
      .get(`${ENDPOINTS.EMPLOYEES}${employee.name}`)
      .then(function (response) {
        const [designation, subordinateData] = response.data;
        const subordinatesList = subordinateData
          ? subordinateData["direct-subordinates"]
          : [];
        employee.designation = designation;
        let promises = [];
        for (const subordinate of subordinatesList) {
          /**
           * if suboridate's name is already in cached, skip it.
           */
          if (!cached[subordinate]) {
            cached[subordinate] = recurse({ name: subordinate });
            promises.push(cached[subordinate]);
          }
        }
        return promises.length
          ? Promise.resolve(Promise.all(promises))
              .then((data) => {
                return employee.name === employeeName
                  ? data.flat()
                  : [employee, ...data.flat()];
              })
              .catch((err) => {
                return employee.name === employeeName ? [] : [employee];
              })
          : Promise.resolve(employee.name === employeeName ? [] : [employee]);
      });

    return tangentialPromiseBranch;
  }
  return recurse({ name: employeeName });
}
