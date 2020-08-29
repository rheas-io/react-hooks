/**
 * A function that takes an argument and returns the same argument
 * after processing on it.
 *
 * Named after @laravel tap function that does the same thing.
 */
export interface ITap<T> {
    (arg: T): T;
}
