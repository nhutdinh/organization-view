import React from "react";
import { Employee } from "../OrganizationView.types";
import {
  ListViewStyled,
  ListViewHeaderStyled,
  ListViewBodyStyled,
  ListViewItemStyled,
} from "./ListView.styled";

interface ListViewProps {
  subordinates: Employee[];
}
const ListView: React.FC<ListViewProps> = (
  props: ListViewProps
): React.ReactElement => {
  const buildItems = (employees: Employee[]) => {
    return employees.map(
      (employee): React.ReactElement => (
        <ListViewItemStyled key={employee.name}>
          <div>{employee.name}</div>
          <div>{employee.designation}</div>
        </ListViewItemStyled>
      )
    );
  };
  return (
    <ListViewStyled>
      <ListViewHeaderStyled>
        <ListViewItemStyled>
          <div>Name</div>
          <div>Designation</div>
        </ListViewItemStyled>
      </ListViewHeaderStyled>
      <ListViewBodyStyled>{buildItems(props.subordinates)}</ListViewBodyStyled>
    </ListViewStyled>
  );
};
export default ListView;
