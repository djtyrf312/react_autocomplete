import { DropdownMenu } from '../dropdownMenu/DropdownMenu';
import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  setDelayedQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedPerson: React.Dispatch<React.SetStateAction<Person | null>>;
  people: Person[];
  isEmptyPeopleList: boolean;
};

export const Dropdown: React.FC<Props> = ({
  setDelayedQuery,
  setSelectedPerson,
  people,
  isEmptyPeopleList,
}) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState('');
  const [isDisplayedDropdown, setIsDisplayedDropdown] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDisplayedDropdown &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setIsDisplayedDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, [isDisplayedDropdown]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            setDelayedQuery(event.target.value);
            setSelectedPerson(null);
          }}
          onFocus={() => {
            setIsDisplayedDropdown(true);
          }}
        />
      </div>

      {!isEmptyPeopleList && isDisplayedDropdown && (
        <DropdownMenu
          people={people}
          dropdownRef={dropdownRef}
          setSelectedPerson={setSelectedPerson}
          setDisplayedDropdown={setIsDisplayedDropdown}
          setQuery={setQuery}
        />
      )}
    </div>
  );
};
