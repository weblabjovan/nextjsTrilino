import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';


const middleware = composeWithDevTools(applyMiddleware(thunk, logger));

export const initializeStore = () => {
  return createStore(
    rootReducer,
    middleware
  )
}