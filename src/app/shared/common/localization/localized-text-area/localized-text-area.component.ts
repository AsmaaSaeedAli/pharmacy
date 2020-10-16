import {
  Component,
  OnInit,
  ViewChild,
  Injector,
  Input,
  Output,
  EventEmitter

} from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'localized-text-area',
  templateUrl: './localized-text-area.component.html',
})

export class LocalizedTextAreaComponent extends AppComponentBase implements OnInit {

  private defaultLanguageCode;
  private _json: string;
  public translations: any[] = [];

  //Form
  @ViewChild('localizedNameForm',{static : true}) form: any;

  //Property name of Entity/Model
  @Input() inlineForm = false;
  @Input() label: string; //Label name
  @Input() maxlength: number; //Max input length
  @Input() required: boolean = null; //Is required
  @Input() alphabetical: boolean = null; //Alphabetical characters only
  @Input() alphanumeric: boolean = null; //Alphanumeric characters only
  @Input() pattern: string; //Regular expression
  @Input() patternErrMsg: string; //Regular expression error message
  @Input()
  set json(json: string) {
      this._json = json;
      this.jsonChange.emit(this._json);
      this.setTranslations();
  }
  get json() {
      return this._json;
  }
  @Output() jsonChange = new EventEmitter<string>(); //Necessery for two-way binding


  constructor(
      injector: Injector) {
      super(injector);
      this.getTenantPreferedLanguages().forEach((code, index) => {
          this.translations.push(
              {
                  id: "_" + code + "_" + index,
                  languageCode: code,
                  translatedText: ""
              })
      });

      //Get default language
      this.defaultLanguageCode = abp.localization.languages.find(l => l.isDefault).name;
  }

  ngOnInit(): void {

  }

  //Get tenants specifed languages
  private getTenantPreferedLanguages(): string[] {
      var languages = [];

      //Get languages
      var preferedLanguages = abp.setting.get("Tenant.PreferedLanguages");
      preferedLanguages.split(",").forEach(languageCode => languages.push(languageCode));

      return languages;
  }

  //Return json text (localized)
  private getJson(): string {
      var jsonObj: any = {};

      //Set json object
      this.translations.forEach(t => {
          jsonObj[t.languageCode] = t.translatedText;
      });

      return JSON.stringify(jsonObj);
  }

  //Set translations from json string
  private setTranslations(): void {
      this.clear();
      if (this.json && this.isValidJson()) {
          var jsonObj = JSON.parse(this.json.toString());

          //Set
          this.translations.forEach(t => {
              t.translatedText = jsonObj[t.languageCode];
          });
      }
  }

  //Check if form is valid
  public valid(): boolean {
      return  this.form.valid;
  }

  //Reset
  private clear(): void {
      this.translations.forEach(t => t.translatedText = "");
  }

  //Check valid json string
  private isValidJson() {
      try {
          JSON.parse(this.json);
      } catch (e) {
          throw 'Invalid json string';
      }
      return true;
  }

  //On input change
  //This will create a new json on each change
  onInputChange(input: string) {
      this.json = this.getJson();
  }

  //Reset form
  reset(): void {
      this.form.resetForm();
  }
}
