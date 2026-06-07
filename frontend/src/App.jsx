import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { fetchFiles, fetchFilesList } from './store/actions';
import FilterBar from './components/FilterBar';
import FilesTable from './components/FilesTable';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilesList());
    dispatch(fetchFiles());
  }, [dispatch]);

  return (
    <>
      <div className="bg-danger text-white p-3 mb-4">
        <Container>
          <h4 className="m-0">React Test App</h4>
        </Container>
      </div>
      <Container>
        <Row className="mb-3">
          <Col md={4}>
            <FilterBar />
          </Col>
        </Row>
        <Row>
          <Col>
            <FilesTable />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
