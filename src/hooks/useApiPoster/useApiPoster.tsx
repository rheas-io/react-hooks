import Axios, { CancelTokenSource } from 'axios';
import { useRef, useEffect, useState } from 'react';
import { AxiosPoster } from '../../helpers/axiosPoster';
import { IPostState, IPostTrigger } from '../../ts/apiPoster';
import { IAxiosResponseHandler, IAxiosErrorHandler } from '../../ts/axiosResponseHandler';

type HookReturns = [IPostState, IPostTrigger];

/**
 * `useApiPoster` works similar to `useApiFetcher` hook. This hook takes
 * care of component post requests. Only one POST request can be made by the
 * component at a time to avoid race conditions. So previous requests are
 * cancelled when issuing a new request and also when the component unmounts.
 *
 * The trigger function of this hook accepts a url, payload, successHandler
 * and an axios config field as parameters. The url and payload is mandatory
 * to perform a request.
 *
 * Unline `useApiFetcher` we are not keeping a state variable for the success response
 * data. In many cases, post request responses will only be an HTTP status code or
 * errors and if there is any response, we won't be able to know its structure before
 * hand. So we avoid state variable on the hook and allow consumer to send a
 * `successHandler` callback function, which will be triggered when an axios response
 * is received. And thus, consumers can work with the response data, the way they want.
 *
 * @returns an array with IPostState variable and IPostTrigger function.
 */
export function useApiPoster(): HookReturns {
    const abort = useRef<CancelTokenSource>();
    const [state, setState] = useState<IPostState>({ posting: false, errors: {} });

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
     * This function is responsible for submitting POST requests to an external
     * API endpoint. The hook consumers has to submit,
     *
     * 1. url - API POST endpoint
     * 2. payload - data to be posted
     * 3. successHandler - an optional axios success callback, which receives axios
     * response as the first parameter.
     * 4. config - axios configs.
     *
     * This function takes care of state variable changes that has to be made during
     * a POST request. Consumer has to watch the state changes and update the UI
     * accordingly.
     *
     * @param url
     * @param payload
     * @param successHandler
     * @param config
     */
    const postData: IPostTrigger = (url, payload, successHandler?, config?) => {
        cancelExistingRequest();

        // Init post by clearing the errors and changing the
        // post status.
        setState({ posting: true, errors: {} });

        config = Object.assign({}, config);

        // Create a new cancel token for the request and add it
        // to the config.
        abort.current = Axios.CancelToken.source();
        config.cancelToken = abort.current.token;

        // Axios post success handler. Reset the state to default and
        // call the successHandler, if one exists.
        const onSuccess: IAxiosResponseHandler = (response) => {
            setState({ posting: false, errors: {} });

            if (typeof successHandler === 'function') {
                successHandler(response);
            }
        };

        const onError: IAxiosErrorHandler = (error) => {
            if (!Axios.isCancel(error)) {
                return setState({ posting: false, errors: error.response?.data });
            }
        };

        // Submits an axios post request
        AxiosPoster(url, payload, onSuccess, onError, config);
    };

    return [state, postData];
}
