import { Directive, forwardRef, Attribute, Input } from '@angular/core';
import {
    Validator,
    AbstractControl,
    NG_VALIDATORS,
    FormControl
} from '@angular/forms';

@Directive({
    selector: '[alphabetical]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AlphabeticalValidator),
            multi: true
        }
    ]
})
export class AlphabeticalValidator implements Validator {
    //Using boolean doesn't work as it always receives a string. Angular doesn't know about boolean
    //https://stackoverflow.com/questions/43874604/boolean-inputs-to-angular-2-component
    @Input('alphabetical') alphabetical: string;

    validate(control: AbstractControl): { [key: string]: any } {
        const givenValue = control.value;
        let validationResult = null;

        //The reason we added the "true" and the "" checks is because the localized text always injects the alphabetical attribute
        //If the attribute value equals "true", it means this is a validation from a localized-text component
        //If the attribute value equals "", it means its from html
        //If none of the values were present, it means that validation attribute wasn't used. In the case of localized-text, attribute value will be null
        //In the case of html, it won't even reach here because the directive is not used

        if (
            givenValue &&
            (this.alphabetical === 'true' || this.alphabetical === '') &&
            !/^[\u0600-\u06FFa-zA-Z\s]+$/.test(givenValue)
        ) {
            validationResult = validationResult || {};
            validationResult.alphabetical = true;
        }

        return validationResult;
    }
}
