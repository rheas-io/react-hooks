import Axios from 'axios';
import { IFetcher } from '../ts/apiFetcher';

/**
 * Axios default config consists of Accept and Content-Type
 * headers set to application/json. This can be overridden by
 * sending new headers field.
 *
 * Axiosfetcher function updates the config using shallow copy, so
 * submitting a config with headers field will replace the default
 * headers.
 *
 * @var object
 */
const default_config = {
    headers: { Accept: 'application/json', 'Content-type': 'application/json' },
};

/**
 * Submits an Axios GET request to the given api endpoint.
 *
 * @param url api endpoint
 * @param callback the axios response handler
 * @param config axios config
 */
const AxiosFetcher: IFetcher = async function (url, onSuccess?, onError?, config?) {
    try {
        config = Object.assign({}, default_config, config);

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
