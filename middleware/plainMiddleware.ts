const plainMiddleware = ({ getState, dispatch }) => next => action => {
  next(action);
}

export default plainMiddleware;