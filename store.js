import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import apiErrorHandlingMiddleware from './middleware/errorHandlerMiddleware';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';


export const initializeStore = () => {
	const middleware = process.env.NODE_ENV === 'production' ? composeWithDevTools(applyMiddleware(thunk, apiErrorHandlingMiddleware)) : composeWithDevTools(applyMiddleware(thunk, apiErrorHandlingMiddleware, logger));

  return createStore(
    rootReducer,
    middleware
  )
}