import _ from 'lodash';
import { Phoneme } from "./Phoneme";
import { NameTemplate } from "./NameTemplate";

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// class NameData
//
// Holds information on phonemes and name templates used in
// building names.
//-------------------------------------------------------------------
export class NameData {
    private _phonemes: Map<string, Phoneme>;
    private _templates: NameTemplate[];

    //===================================================================
    // Description:  Constructor.
    //-------------------------------------------------------------------
    private constructor() {
        this._phonemes = new Map();
        this._templates = [];
    }

    get templates(): NameTemplate[] {
        return this._templates;
    }

    //===================================================================
    // Description:
    //
    // Creates a new phoneme, add it to our list, and returns it.
    //-------------------------------------------------------------------
    public addPhoneme(phoneme: string): Phoneme {
        const phData = Phoneme.withName(phoneme);
        this._phonemes.set(phoneme, phData);
        return phData;
    }

    //===================================================================
    // Description:
    //
    // Creates a new template, add it to our list, and returns it.
    //-------------------------------------------------------------------
    public addTemplate(template: string): NameTemplate {
        const temp = NameTemplate.withName(template);
        this._templates.push(temp);
        return temp;
    }

    //===================================================================
    // Description:
    //
    // Finds and returns the phoneme data with the indicated name.
    //-------------------------------------------------------------------
    public getPhoneme(phoneme: string): Phoneme {
        return this._phonemes.get(phoneme);
    }

    public static from(data: unknown): NameData | null {
        if (!_.isPlainObject(data)) {
            console.error(`Expected JSON object, received '${_.toString(data)}'`);
            return null;
        }
        let nameData: NameData = new NameData();
        if (!_.has(data, 'NameData.PhonemeList.0.Phoneme')) {
            console.error('Name data is missing phoneme list');
            return null;
        }
        const phonemes: Phoneme[] = _.chain(data as object).get('NameData.PhonemeList.0.Phoneme').map(Phoneme.from).value();
        _.remove(phonemes, _.isNil);
        phonemes.forEach(phoneme => {
            nameData._phonemes.set(phoneme.name, phoneme);
        });
        if (!_.has(data, 'NameData.NameTemplateList.0.NameTemplate')) {
            console.error('Name data is missing name template list');
            return null;
        }
        nameData._templates = _.chain(data as object).get('NameData.NameTemplateList.0.NameTemplate').map(nameTemplateData => {
            return NameTemplate.from(nameTemplateData, nameData);
        }).value();
        _.remove(nameData._templates, _.isNil);
        return nameData;
    }
}
