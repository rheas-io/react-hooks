import Axios from 'axios';
import { IFetcher } from '../ts/apiFetcher';
import { axiosDefaultConfig } from './axiosDefaultConfig';

/**
 * Submits an Axios GET request to the given api endpoint.
 *
 * @param url api endpoint
 * @param callback the axios response handler
 * @param config axios config
 */
const AxiosFetcher: IFetcher = async function (url, onSuccess?, onError?, config?) {
    try {
        config = Object.assign({}, axiosDefaultConfig, config);

        let response = await Axios.get(url, config);

        if (typeof onSuccess === 'function') {
            return onSuccess(response);
        }
    } catch (err) {
        // If an error handler is defined, it is executed with
        // the thrown error.
        if (typeof onError === 'function') {
            return onError(err);
        }
    }
};

export { AxiosFetcher };
