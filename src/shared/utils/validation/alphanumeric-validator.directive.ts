import { Directive, forwardRef, Attribute, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';


@Directive({
    selector: '[alphanumeric]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AlphanumericValidator), multi: true }
    ]
})
export class AlphanumericValidator implements Validator {

    //Using boolean doesn't work as it always recieves a string. Anuglare doesn't know about boolean
    //https://stackoverflow.com/questions/43874604/boolean-inputs-to-angular-2-component
    @Input('alphanumeric') alphanumeric: string;

    validate(control: AbstractControl): { [key: string]: any } {
        const givenvalue = control.value;
        let validationResult = null;

        //The reason we added the "true" and the "" checks is because the localzied text always injects the alphabetical attribute
        //If the attribute value equals "true", it means this is a validation from a localized-text component
        //If the attribute value equals "", it means its from html
        //If none of the values were present, it means that validation attribute wasn't used. In the case of localized-text, attribute value will be null
        //In the case of html, it won't even reach here because the directive is not used

        if (givenvalue && (this.alphanumeric == "true" || this.alphanumeric == "") && !/^[\u0600-\u06FFA-Za-z0-9٠-٩ ]+$/.test(givenvalue)) {
            validationResult = {};
            validationResult.alphanumeric = true;
        } 

        return validationResult;
    }
}
