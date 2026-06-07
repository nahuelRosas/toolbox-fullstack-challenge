import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../src/App';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('App Component', () => {
  it('renders without crashing', () => {
    const store = mockStore({
      files: [],
      filesList: [],
      filter: '',
      loading: false,
      error: null
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('React Test App')).toBeInTheDocument();
  });
});
