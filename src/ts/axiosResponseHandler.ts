import { AxiosResponse, AxiosError } from 'axios';

export interface IAxiosResponseHandler {
    (response: AxiosResponse): void;
}

export interface IAxiosErrorHandler {
    (error: AxiosError): void;
}
