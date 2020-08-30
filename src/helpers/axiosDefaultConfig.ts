/**
 * Axios default config consists of Accept and Content-Type
 * headers set to application/json. This can be overridden by
 * sending new headers field.
 *
 * Axios fetcher/poster function updates the config using shallow copy, so
 * submitting a config with headers field will replace the default
 * headers.
 *
 * @var object
 */
export const axiosDefaultConfig = {
    headers: { Accept: 'application/json', 'Content-type': 'application/json' },
};
