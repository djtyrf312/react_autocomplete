import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import { Alert } from './components/alert/Alert';
import { Dropdown } from './components/dropdown/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const setDelayedQuery = React.useMemo(
    () => debounce(setAppliedQuery, 300),
    [],
  );
  const filteredPeople = React.useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);
  const isEmptyPeopleList = filteredPeople.length === 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          setDelayedQuery={setDelayedQuery}
          setSelectedPerson={setSelectedPerson}
          people={filteredPeople}
          isEmptyPeopleList={isEmptyPeopleList}
        />
        {isEmptyPeopleList && <Alert />}
      </main>
    </div>
  );
};
