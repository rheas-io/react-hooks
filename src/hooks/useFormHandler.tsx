import { AnyObject } from '../ts/keyValue';
import { InputChangeHandler } from '../ts/reactHandlers';
import { useState, useCallback, Dispatch, SetStateAction } from 'react';

type HookReturns<T> = [T, Dispatch<SetStateAction<T>>, InputChangeHandler<HTMLElement>];

/**
 * Hook to update form field values. This hook provides a formData
 * state object, a function to update this state and an input change
 * listener function.
 *
 * Submit a default formData to this hook and connect the form input fields
 * with the listener of this hook. Whenever the form field value changes, this
 * hook will update the formData.
 *
 * The key of the formData will be the name of the input element. For example,
 * when input changes on the element <input name='first_name'/>, formData will update
 * the first_name field or create a new one and sets the input value.
 *
 * @param defaultData
 */
export function useFormHandler<T extends AnyObject>(defaultData: T): HookReturns<T> {
    const [formData, setFormData] = useState(defaultData);

    /**
     * Input change event listener. Pass this handler as onChange prop to form input
     * fields. Event is passed as argument, so the state should change the target
     * element name field with the target value.
     *
     * Hooks don't merge states as in Class components. So merge, previous
     * state and new value.
     *
     * @param event Input element text change event
     */
    const onInputChange: InputChangeHandler<HTMLElement> = useCallback((event) => {
        const element = event.target as HTMLInputElement;

        let value: string | boolean = element.value;

        if (element.type === 'checkbox') {
            value = element.checked;
        }
        let update = { [element.name]: value };

        setFormData((oldForm) => Object.assign({}, oldForm, update));
    }, []);

    return [formData, setFormData, onInputChange];
}
