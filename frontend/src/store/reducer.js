import * as types from './actionTypes';

const initialState = {
  files: [],
  filesList: [],
  filter: '',
  loading: false,
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_FILES_REQUEST:
      return { ...state, loading: true, error: null };
    case types.FETCH_FILES_SUCCESS:
      return { ...state, loading: false, files: action.payload, error: null };
    case types.FETCH_FILES_FAILURE:
      return { ...state, loading: false, error: action.payload, files: [] };
    case types.FETCH_FILES_LIST_SUCCESS:
      return { ...state, filesList: action.payload };
    case types.SET_FILTER:
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

export default reducer;
