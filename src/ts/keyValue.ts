export interface KeyValue<T> {
    [key: string]: T;
}
export interface AnyObject extends KeyValue<any> {
}
export interface StringObject extends KeyValue<string> {
}