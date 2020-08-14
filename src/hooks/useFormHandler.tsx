import { AnyObject } from "../ts/keyValue";
import { InputChangeHandler } from "../ts/reactHandlers";
import { useState, useCallback, Dispatch, SetStateAction } from "react";

type HookReturns<T> = [T, Dispatch<SetStateAction<T>>, InputChangeHandler<HTMLElement>];

export function useFormHandler<T extends AnyObject>(defaultData: T): HookReturns<T> {
  const [formData, setFormData] = useState(defaultData);

  /**
   * Changes the state of the component when there is an input change.
   * Event is passed as argument, so the state should change the target
   * element name field with the target value.
   *
   * Hooks don't merge states as in Class components. So merge, previous
   * state and new value.
   *
   * Pass this handler as onChange prop to the FormTextInput
   *
   * @param event Input element text change event
   */
  const onInputChange: InputChangeHandler<HTMLElement> = useCallback((event) => {
    const element = event.target as HTMLInputElement;

    let value: string | boolean = element.value;

    if (element.type === "checkbox") {
      value = element.checked;
    }
    let update = { [element.name]: value };

    setFormData((oldForm) => Object.assign({}, oldForm, update));
  }, []);

  return [formData, setFormData, onInputChange];
}
