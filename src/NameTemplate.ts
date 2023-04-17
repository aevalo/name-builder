import _ from 'lodash';
import { Phoneme } from "./Phoneme";
import { NameData } from "./NameData";

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// class TemplateData
//
// Holds information on an individual name template, which is
// an array of pointers to PhonemeData instances.
//-------------------------------------------------------------------
export class NameTemplate {
    private _name: string;
    private _elements: Phoneme[];
    private _caps: boolean[];

    //===================================================================
    // Description:  Constructor.
    //-------------------------------------------------------------------
    private constructor(name: string) {
        if (!_.isString(name) || _.isEmpty(name)) {
            throw new TypeError("Template name must be a valid string");
        }
        this._name = name;
        this._elements = [];
        this._caps = [];
    }

    get name(): string {
        return this._name;
    }

    get elements(): Phoneme[] {
        return this._elements;
    }

    get caps(): boolean[] {
        return this._caps;
    }

    //===================================================================
    // Description:
    //
    // Appends a new phoneme to our list.
    //-------------------------------------------------------------------
    public add(phoneme: Phoneme): void {
        this._elements.push(phoneme);
        this._caps.push(false);
    }

    //===================================================================
    // Description:
    //
    // Set new capital at given index.
    //-------------------------------------------------------------------
    public addCapAt(index: number) {
        this._caps[index] = true;
    }

    public static from(data: unknown, nameData: NameData): NameTemplate | null {
        if (!_.isPlainObject(data)) {
            console.error(`Expected JSON object, received '${_.toString(data)}'`);
            return null;
        }
        if (!_.has(data, '$.Name')) {
            console.error('Name template is missing name');
            return null;
        }
        const name: string = _.get(data, '$.Name');
        if (!_.has(data, 'Part')) {
            console.error('Name template is missing part list');
            return null;
        }
        let nameTemplate: NameTemplate = new NameTemplate(name);
        const parts: Record<'name' | 'type', string>[] = _.chain(data as object).get('Part').filter(part => {
            if (!_.has(part, '$.Type')) {
                console.error('Name template part is missing part type');
                return false;
            }
            const partType: string = _.get(part, '$.Type');
            if (partType !== 'Cap' && partType !== 'Normal') {
                console.error(`Expected name part type to be 'Cap' or 'Normal', got '${_.toString(partType)}'`);
                return false;
            }
            const partName: string = _.get(part, '_');
            return _.isString(partName) && !_.isEmpty(partName);
        }).map(part => {
            return {'name': _.get(part, '_'), 'type': _.get(part, '$.Type')};
        }).value();
        parts.forEach((part: Record<'name' | 'type', string>, partIndex: number) => {
            const phoneme: Phoneme = nameData.getPhoneme(part.name);
            nameTemplate.add(phoneme);
            if (part.type === 'Cap') {
                nameTemplate.addCapAt(partIndex);
            }
        });
        return nameTemplate;
    }

    public static withName(name: string): NameTemplate {
        return new NameTemplate(name);
    }
}
