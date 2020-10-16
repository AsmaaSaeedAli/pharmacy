export  class LocalizedTextUtil {

    static getCurrentLanguageLocalizedText(localizedJson: string): string {
 
        if(localizedJson)
        {
            let currentlanguage = abp.localization.currentLanguage.name;
            let parsedName = JSON.parse(localizedJson);
            return parsedName[currentlanguage];
        }       
    }
}
