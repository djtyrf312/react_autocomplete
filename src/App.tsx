import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );
  const [query, setQuery] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const setDelayedQuery = React.useMemo(
    () => debounce(setAppliedQuery, 300),
    [],
  );
  const filteredPeople = React.useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(
        appliedQuery.toLowerCase()
      ),
    );
  }, [appliedQuery]);
  const [isDisplayedDropdown, setIsDisplayedDropdown] =
    React.useState(false);
  const isEmptyPeopleList = filteredPeople.length === 0;
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

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
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
              ref={dropdownRef}
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    key={person.slug}
                    data-cy="suggestion-item"
                    onClick={() => {
                      setSelectedPerson(person);
                      setIsDisplayedDropdown(false);
                      setQuery(person.name);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                    {/*todo add class for has-text-danger if person is dead*/}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {isEmptyPeopleList && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
