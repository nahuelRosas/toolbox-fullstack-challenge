import axios from 'axios';
import * as types from './actionTypes';

export const fetchFiles = (fileName = '') => {
  return async (dispatch) => {
    dispatch({ type: types.FETCH_FILES_REQUEST });
    try {
      const url = fileName ? `/files/data?fileName=${fileName}` : '/files/data';
      const response = await axios.get(url);
      dispatch({ type: types.FETCH_FILES_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: types.FETCH_FILES_FAILURE, payload: error.message });
    }
  };
};

export const fetchFilesList = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/files/list');
      dispatch({ type: types.FETCH_FILES_LIST_SUCCESS, payload: response.data.files });
    } catch (error) {
      console.error('Error fetching file list', error);
    }
  };
};

export const setFilter = (fileName) => {
  return (dispatch) => {
    dispatch({ type: types.SET_FILTER, payload: fileName });
    dispatch(fetchFiles(fileName));
  };
};
