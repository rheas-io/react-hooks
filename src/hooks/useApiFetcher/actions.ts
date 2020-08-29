import { AxiosError } from 'axios';
import { ITap } from '../../ts/tap';
import { IFetchAction, FetchActions } from '../../ts/apiFetcher';

/**
 * Action to trigger the initialization handler of API fetch.
 *
 * @returns
 */
export function initFetch(): IFetchAction {
    return { type: FetchActions.INIT_FETCH };
}

/**
 * Action to trigger the success handler of API fetch.
 *
 * @param response
 */
export function fetchSuccess(response: any): IFetchAction {
    return { type: FetchActions.INIT_FETCH, response };
}

/**
 * Action to trigger the failure handler of API fetch.
 *
 * @param errors
 */
export function fetchError(errors: AxiosError): IFetchAction {
    return { type: FetchActions.FETCH_ERROR, errors };
}

/**
 * Action to trigger the fetched data's update handler.
 *
 * @param dataUpdater
 */
export function updateState<T>(dataUpdater: ITap<T>): IFetchAction<T> {
    return { type: FetchActions.UPDATE_DATA, dataUpdater };
}
