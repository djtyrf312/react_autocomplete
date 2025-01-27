import { DropdownMenu } from '../dropdownMenu/DropdownMenu';
import React from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  onQueryChange: React.Dispatch<React.SetStateAction<string>>;
  onPersonSelect: React.Dispatch<React.SetStateAction<Person | null>>;
  people: Person[];
  isEmptyPeople: boolean;
  debounceDelay: number;
};

export const Dropdown: React.FC<Props> = ({
  onPersonSelect,
  people,
  isEmptyPeople,
  onQueryChange,
  debounceDelay,
}) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState('');
  const [isDisplayedDropdown, setIsDisplayedDropdown] = React.useState(false);
  const setDelayedQuery = React.useMemo(
    () => debounce(onQueryChange, debounceDelay),
    [debounceDelay, onQueryChange],
  );

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
            onPersonSelect(null);
          }}
          onFocus={() => {
            setIsDisplayedDropdown(true);
          }}
        />
      </div>

      {!isEmptyPeople && isDisplayedDropdown && (
        <DropdownMenu
          people={people}
          dropdownRef={dropdownRef}
          setSelectedPerson={onPersonSelect}
          setDisplayedDropdown={setIsDisplayedDropdown}
          setQuery={setQuery}
        />
      )}
    </div>
  );
};
