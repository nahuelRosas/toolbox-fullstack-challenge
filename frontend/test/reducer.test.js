import reducer from '../src/store/reducer';
import * as types from '../src/store/actionTypes';

describe('Redux Reducer', () => {
  const initialState = {
    files: [],
    filesList: [],
    filter: '',
    loading: false,
    error: null
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_FILES_REQUEST', () => {
    expect(
      reducer(initialState, {
        type: types.FETCH_FILES_REQUEST
      })
    ).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('should handle FETCH_FILES_SUCCESS', () => {
    const payload = [{ file: 'test.csv', lines: [] }];
    expect(
      reducer(initialState, {
        type: types.FETCH_FILES_SUCCESS,
        payload
      })
    ).toEqual({
      ...initialState,
      loading: false,
      files: payload,
      error: null
    });
  });

  it('should handle FETCH_FILES_FAILURE', () => {
    expect(
      reducer(initialState, {
        type: types.FETCH_FILES_FAILURE,
        payload: 'Error message'
      })
    ).toEqual({
      ...initialState,
      loading: false,
      error: 'Error message',
      files: []
    });
  });

  it('should handle FETCH_FILES_LIST_SUCCESS', () => {
    const payload = ['test.csv'];
    expect(
      reducer(initialState, {
        type: types.FETCH_FILES_LIST_SUCCESS,
        payload
      })
    ).toEqual({
      ...initialState,
      filesList: payload
    });
  });

  it('should handle SET_FILTER', () => {
    expect(
      reducer(initialState, {
        type: types.SET_FILTER,
        payload: 'test.csv'
      })
    ).toEqual({
      ...initialState,
      filter: 'test.csv'
    });
  });
});
