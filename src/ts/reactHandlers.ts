import { ChangeEvent, FormEvent } from 'react';

export interface ClickHandler {
    (event: React.MouseEvent, ...args: any): any;
}

export interface InputChangeHandler<T extends HTMLElement = HTMLInputElement> {
    (event: ChangeEvent<T>): any;
}

export interface SelectChangeHandler {
    (event: ChangeEvent<HTMLSelectElement>): any;
}

export interface FormSubmitHandler {
    (event: FormEvent<HTMLFormElement>): any;
}
