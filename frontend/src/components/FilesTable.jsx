import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Spinner, Alert } from 'react-bootstrap';

const FilesTable = () => {
  const { files, loading, error } = useSelector((state) => state);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!files || files.length === 0) {
    return <Alert variant="info">No data available</Alert>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </tr>
      </thead>
      <tbody>
        {files.map((fileObj) =>
          fileObj.lines.map((line, idx) => (
            <tr key={`${fileObj.file}-${idx}`}>
              <td>{fileObj.file}</td>
              <td>{line.text}</td>
              <td>{line.number}</td>
              <td>{line.hex}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default FilesTable;
