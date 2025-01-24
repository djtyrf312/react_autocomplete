import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = React.useState<Person>(
    peopleFromServer[0],
  );
  const { name, born, died } = selectedPerson;
  const [query, setQuery] = React.useState('');
  const filteredPeople = React.useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);
  const [isDisplayedDropdown, setIsDisplayedDropdown] = React.useState(false);
  const isEmptyPeopleList = filteredPeople.length === 0;

  React.useEffect(() => {
    if (isEmptyPeopleList) {
      setIsDisplayedDropdown(false);
    } else {
      setIsDisplayedDropdown(true);
    }
  }, [isEmptyPeopleList]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${name} (${born} - ${died})`}
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
              }}
              onFocus={() => {
                if (!isEmptyPeopleList) {
                  setIsDisplayedDropdown(true);
                }
              }}
            />
          </div>

          {isDisplayedDropdown && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
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
