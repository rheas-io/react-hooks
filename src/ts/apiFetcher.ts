import { ITap } from './tap';
import { KeyValue } from './keyValue';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { IAxiosResponseHandler, IAxiosErrorHandler } from './axiosResponseHandler';

export enum FetchActions {
    INIT_FETCH,
    FETCH_SUCCESS,
    FETCH_ERROR,
    UPDATE_DATA,
}

/**
 * One API fetch request will have the following three states.
 *
 * [1] data - response data or the initial value
 * [2] fetching - fetch status to update UI
 * [3] errors - errors returned if the fetch was a failure.
 */
export interface IFetchState<T> {
    data: T;
    fetching: boolean;
    errors: KeyValue<string[]>;
}

/**
 * Axios API fetch actions can be either fetch init, fetch success,
 * fetch error or state update request. All fetch action has a mandatory
 * type field and optional payload fields.
 *
 * The interface uses strictly typed optional fields instead of single
 * payload with a static type for clear action definition.
 */
export interface IFetchAction<T = any> {
    type: FetchActions;
    response?: T;
    errors?: AxiosError;
    dataUpdater?: ITap<T>;
}

/**
 * An axios fetcher is a function that takes the following as params
 *
 * [1] url - the api endpoint
 * [2] onSuccess - axios success handler
 * [3] onError - axios error handler
 * [4] config - axios configs
 *
 * Returns void. The callbacks will be executed when the axios response
 * is received.
 *
 * A helper function exposes the axios fetch capabilities, if the user
 * don't want to use hooks.
 */
export interface IFetcher {
    (
        url: string,
        onSuccess?: IAxiosResponseHandler,
        onError?: IAxiosErrorHandler,
        config?: AxiosRequestConfig,
    ): void;
}

/**
 * The dispatch function of the useApiFetch hook. Just pass in the api
 * endpoint and axios configs to this function and the hook will take
 * care of dispatching the request via Axios.
 *
 * In short, hook will create an onSuccess and onError callback within itself
 * and call the axios IFetcher function and take care of the state management.
 * Hook consumers will just have to watch the state changes and update the UI.
 */
export interface IFetchDispatch {
    (url: string, config?: AxiosRequestConfig): void;
}

/**
 * A reducer handler function takes state and action as parameters and
 * returns the update state value after processing.
 *
 * A third parameter init is also passed, which is the default value set as
 * state. This comes in handy, when the action requires setting the state to its
 * default value.
 */
export interface ActionHandler {
    <T>(state: IFetchState<T>, action: IFetchAction<T>, init: T): IFetchState<T>;
}
