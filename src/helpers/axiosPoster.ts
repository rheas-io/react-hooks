import Axios from 'axios';
import { IPoster } from '../ts/apiPoster';
import { axiosDefaultConfig } from './axiosDefaultConfig';

/**
 * Posts the given payload to the specified external Url using Axios.
 *
 * @param url
 * @param payload
 * @param onSuccess
 * @param onError
 * @param config
 */
const AxiosPoster: IPoster = async (url, payload, onSuccess?, onError?, config?) => {
    try {
        config = Object.assign({}, axiosDefaultConfig, config);

        let response = await Axios.post(url, payload, config);

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

export { AxiosPoster };
