import {
    ActionHandler,
    IFetchState as IState,
    FetchActions as Actions,
    IFetchAction as IAction,
} from '../../ts/apiFetcher';

const actionHandlers = new Map<Actions, ActionHandler>();

actionHandlers.set(Actions.INIT_FETCH, initFetch);
actionHandlers.set(Actions.FETCH_SUCCESS, onSuccess);
actionHandlers.set(Actions.FETCH_ERROR, onError);
actionHandlers.set(Actions.UPDATE_DATA, onUpdate);

/**
 * Returns the actual reducer function that updates the fetchState for
 * corresponding actions.
 *
 * By passing in the initial data state, we enforce strict type check and
 * can also be used to set the state.data to its default value.
 *
 * @param init
 */
export function getReducer<T>(init: T) {
    /**
     * The actual reducer function that performs the state updates
     * for every received action.
     *
     * If no matching action is found, the current state is returned
     * as is.
     *
     * @param state
     * @param action
     */
    return function fetchReducer(state: IState<T>, action: IAction<T>): IState<T> {
        const handler = actionHandlers.get(action.type);

        if (handler) {
            return handler(state, action, init);
        }
        return state;
    };
}

/**
 * Sets the fetching state to true and clears all the errors. Usually
 * used when the fetch begins.
 *
 * @param state
 */
function initFetch<T>(state: IState<T>): IState<T> {
    return Object.assign({}, state, { fetching: true, errors: {} });
}

/**
 * Sets the value of axios response as data state, fetching is set to false
 * and errors are cleared.
 *
 * @param state
 * @param action
 */
function onSuccess<T>(state: IState<T>, action: IAction<T>): IState<T> {
    return { data: action.response || state.data, fetching: false, errors: {} };
}

/**
 * Updates the state by setting the error state. state.fetching is set to
 * false.
 *
 * @param state
 * @param action
 */
function onError<T>(state: IState<T>, action: IAction<T>): IState<T> {
    return Object.assign({}, state, { fetching: false, errors: action.errors });
}

/**
 * Updates the state.data by calling the action.dataUpdater function. The
 * function should return the updated data.
 * 
 * @param state
 * @param action
 */
function onUpdate<T>(state: IState<T>, action: IAction<T>): IState<T> {
    if (action.dataUpdater) {
        return Object.assign({}, state, { data: action.dataUpdater(state.data) });
    }
    return state;
}
