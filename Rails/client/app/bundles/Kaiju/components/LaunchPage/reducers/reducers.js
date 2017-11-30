import { combineReducers } from 'redux';
import searchFilter from './searchFilter';
import selectedListItem from './selectedListItem';

const reducers = combineReducers({
  selectedListItem,
  searchFilter,
});

export default reducers;
