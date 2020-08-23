import queryString from "query-string";
import React from "react";
import { useHistory } from "react-router-dom";
import ListView from "./ListView/ListView";
import {
  OrganizationViewControlsStyled,
  OrganizationViewInstructionStyled,
  OrganizationViewSearchResultStyled,
  OrganizationViewSearchResultWrapperStyled,
  OrganizationViewStyled,
} from "./OrganizationView.styled";
import { Employee } from "./OrganizationView.types";
import { getInfo } from "./OrganizationView.utils";

const OrganizationView: React.FC = (): React.ReactElement => {
  const [searchStr, setSearchStr] = React.useState<string>("");
  const [tempSearchStr, setTempSearchStr] = React.useState<string>("");
  const [searchResult, setSearchResult] = React.useState<Employee[]>();
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

  React.useEffect(() => {
    let params = queryString.parse(history.location.search);
    const employeeName = params.name as string;

    if (employeeName && employeeName !== searchStr) {
      setSearchStr(employeeName);
      setTempSearchStr(employeeName);
      search(employeeName);
    }
  }, [history.location.search]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearchStr(event.target.value);
    if (!event.target.value) {
      setSearchStr("");
    }
  };
  const search = (employeeName = searchStr) => {
    if (loading) {
      return;
    }
    setLoading(true);
    history.push(`/overview?name=${employeeName}`);

    getInfo(employeeName)
      .then((data) => {
        setSearchResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setSearchResult([]);
        setLoading(false);
      });
  };

  const onSearchBtnClicked = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSearchStr(tempSearchStr);
    search(tempSearchStr);
  };

  const onKeyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchStr(tempSearchStr);
      search(tempSearchStr);
    }
  };

  const getSearchResult = (): React.ReactNode => {
    if (loading) {
      return (
        <OrganizationViewInstructionStyled data-testid="organization-view__instruction-text">
          Loading...
        </OrganizationViewInstructionStyled>
      );
    }
    if (!searchResult || !searchStr) {
      return (
        <OrganizationViewInstructionStyled data-testid="organization-view__instruction-text">
          Input Employee's name and Click Search to start...
        </OrganizationViewInstructionStyled>
      );
    }
    return searchResult.length === 0 ? (
      <OrganizationViewInstructionStyled data-testid="organization-view__instruction-text">
        No results found
      </OrganizationViewInstructionStyled>
    ) : (
      <OrganizationViewSearchResultStyled>
        <ListView subordinates={searchResult} />
      </OrganizationViewSearchResultStyled>
    );
  };

  return (
    <OrganizationViewStyled>
      <OrganizationViewControlsStyled>
        <input
          data-testid="organization-view__search-input"
          placeholder={"Employee's name..."}
          type="text"
          onChange={onChangeHandler}
          value={tempSearchStr}
          onKeyPress={onKeyPressHandler}
        ></input>
        <button
          disabled={loading || !tempSearchStr}
          onClick={onSearchBtnClicked}
          data-testid="organization-view__search-btn"
        >
          Search
        </button>
      </OrganizationViewControlsStyled>
      <OrganizationViewSearchResultWrapperStyled>
        {getSearchResult()}
      </OrganizationViewSearchResultWrapperStyled>
    </OrganizationViewStyled>
  );
};
export default OrganizationView;
