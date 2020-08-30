import { AxiosRequestConfig } from 'axios';
import { AnyObject, KeyValue } from './keyValue';
import { IAxiosResponseHandler, IAxiosErrorHandler } from './axiosResponseHandler';

/**
 * An API post request will have the following two state variables.
 *
 * 1. posting - status to update UI
 * 2. errors - errors returned if the post was a failure.
 */
export interface IPostState {
    posting: boolean;
    errors: KeyValue<string[]>;
}

/**
 * An axios poster is a function that takes the following as params
 *
 * 1. url - the api endpoint
 * 2. payload - the json data that has to be send
 * 3. onSuccess - axios success handler
 * 4. onError - axios error handler
 * 5. config - axios configs
 *
 * Returns void. The callbacks will be executed when the axios response
 * is received.
 *
 * This helper function can be used to post data to external endpoints. All
 * the state management has to be handledd manually if this function is used
 * insted of `useApiPoster` hook
 */
export interface IPoster {
    (
        url: string,
        payload: AnyObject,
        onSuccess?: IAxiosResponseHandler,
        onError?: IAxiosErrorHandler,
        config?: AxiosRequestConfig,
    ): void;
}

/**
 * The post trigger function of the `useApiPoster` hook. Just pass in the api
 * endpoint, payload and an optional axios configs to this function and the
 * hook will take care of dispatching the request via Axios.
 *
 * In short, hook will create an `onSuccess` and `onError` callback within itself
 * and call the axios `IPoster` function and take care of the state management.
 * Hook consumers will just have to watch the state changes and update the UI.
 *
 * An optional `successHandler` can be passed to process axios post response.
 */
export interface IPostTrigger {
    (
        url: string,
        payload: AnyObject,
        successHandler?: IAxiosResponseHandler,
        config?: AxiosRequestConfig,
    ): void;
}
