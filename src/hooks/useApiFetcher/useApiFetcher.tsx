import { getReducer } from './reducer';
import Axios, { CancelTokenSource } from 'axios';
import { AxiosFetcher } from '../../helpers/axiosFetcher';
import { Dispatch, useReducer, useEffect, useRef } from 'react';
import { initFetch, fetchSuccess, fetchError } from './actions';
import { IFetchState, IFetchTrigger, IFetchAction } from '../../ts/apiFetcher';
import { IAxiosResponseHandler, IAxiosErrorHandler } from '../../ts/axiosResponseHandler';

type HookReturns<T> = [IFetchState<T>, IFetchTrigger, Dispatch<IFetchAction<T>>];

/**
 * A dedicated API fetcher for a component. Use this hook to request
 * component data from external API. This hook exposes a state variable,
 * a fetch trigger function and a reducer dispatch function which can be
 * used to update the state variable.
 *
 * [1] State variable is an object with a data field, fetching status field
 * and an error field.
 *
 * data - The variable that hold the fetch response. An initial value has to be
 * submitted as an argument to this hook. This facilitates strict type check.
 *
 * fetching - the fetch status indicater which is a boolean value. Components can
 * use this to show loading indicators.
 *
 * errors - the field holds the error response if the fetch fails.
 *
 * [2] fetchData function is used to trigger the API fetch. Consumer component
 * should call this function with a url and optional axios config to trigger the
 * API fetch.
 *
 * [3] dispatch - reducer dispatch function exposed to make updates on the state.data
 * field. In most cases, consumer components won't need this.
 *
 * @param init
 */
export function useApiFetcher<T>(init: T): HookReturns<T> {
    /**
     * Default state of the apiFetcher consists of data field
     * which holds the initial data, the fetch status, and the
     * errors field.
     *
     * Initial data is responsible for defining the structure of
     * expected response.
     */
    const defaultState: IFetchState<T> = {
        data: init,
        fetching: false,
        errors: {},
    };
    const abort = useRef<CancelTokenSource>();
    const [state, dispatch] = useReducer(getReducer(init), defaultState);

    /**
     * Function to cancel the current API fetch request.
     *
     * `useApiFetcher()` hook allows only one fetch at a time. This is to avoid
     * race conditions. For example, if a response from a second request arrives
     * earlier than the first request, the state will be first updated with the
     * second request's response and the first request's response will be set
     * later causing a bad UX.
     *
     * To prevent this, we cancel any existing request before proceeding with a
     * second request. `cancelExistingRequest()` is called whenever a fetch request
     * is made and also when component unmounts.
     *
     * Since `abort` is a mutable ref object holding the previous request's CancelToken,
     * we can cancel it even if this hook updates after a state changes.
     */
    const cancelExistingRequest = () => {
        if (abort.current) {
            abort.current.cancel('Cancelling existing request.');
        }
    };

    /**
     * Cancel the axios request when component unmounts. This is to
     * prevent updates on invalid/non-existant state variables.
     */
    useEffect(() => {
        return () => {
            cancelExistingRequest();
        };
    }, []);

    /**
     * Fetches data from the API endpoint and updates the state at different
     * stages. This is the core function of the hook, which has to be consumed
     * by components by submitting the API endpoint.
     *
     * @param url api endpoint
     * @param config axios configs
     */
    const fetchData: IFetchTrigger = (url, config?) => {
        cancelExistingRequest();

        dispatch(initFetch());

        config = Object.assign({}, config);

        abort.current = Axios.CancelToken.source();
        config.cancelToken = abort.current.token;

        const onSuccess: IAxiosResponseHandler = (response) => {
            return dispatch(fetchSuccess(response.data));
        };

        const onError: IAxiosErrorHandler = (error) => {
            if (!Axios.isCancel(error)) {
                return dispatch(fetchError(error));
            }
        };

        // Initiate the API GET request
        AxiosFetcher(url, onSuccess, onError, config);
    };

    return [state, fetchData, dispatch];
}
