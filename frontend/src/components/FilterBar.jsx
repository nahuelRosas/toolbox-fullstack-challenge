import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';
import { setFilter } from '../store/actions';

const FilterBar = () => {
  const dispatch = useDispatch();
  const { filesList, filter } = useSelector((state) => state);

  const handleChange = (e) => {
    dispatch(setFilter(e.target.value));
  };

  return (
    <Form.Group controlId="filterSelect">
      <Form.Select value={filter} onChange={handleChange} aria-label="Filter files">
        <option value="">All Files</option>
        {filesList.map((fileName) => (
          <option key={fileName} value={fileName}>
            {fileName}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default FilterBar;
