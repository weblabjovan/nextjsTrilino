import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import plainMiddleware from './middleware/plainMiddleware';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';




export const initializeStore = () => {

	const middleware = composeWithDevTools(applyMiddleware(thunk, logger));
	
  return createStore(
    rootReducer,
    middleware
  )
}