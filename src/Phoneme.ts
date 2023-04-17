import _ from 'lodash';

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// class PhonemeData
//
// Holds information on an individual type of phoneme (e.g.,
// "Consonant," "Vowel," "Nasal").
//-------------------------------------------------------------------
export class Phoneme {
    private _name: string;
    private _elements: string[];

    //===================================================================
    // Description:  Constructor.
    //-------------------------------------------------------------------
    private constructor(name: string) {
        if (!_.isString(name) || _.isEmpty(name)) {
            throw new TypeError("Phoneme name must be a valid string");
        }
        this._name = name;
        this._elements = [];
    }

    public get name(): string {
        return this._name;
    }

    public get elements(): string[] {
        return this._elements;
    }

    //===================================================================
    // Description:
    //
    // Appends a new element to our list.
    //-------------------------------------------------------------------
    public add(element: string): void {
        if (!_.isString(element) || _.isEmpty(element)) {
            throw new TypeError("Phoneme element must be a valid string");
        }
        this._elements.push(element);
    }

    public static from(data: unknown): Phoneme | null {
        if (!_.isPlainObject(data)) {
            console.error(`Expected JSON object, received '${_.toString(data)}'`);
            return null;
        }
        if (!_.has(data, '$.Name')) {
            console.error('Phoneme is missing name');
            return null;
        }
        const name: string = _.get(data, '$.Name');
        if (!_.has(data, 'Part')) {
            console.error('Phoneme is missing part list');
            return null;
        }
        let phoneme: Phoneme = new Phoneme(name);
        const parts: string[] = _.chain(data as object).get('Part').filter(_.isString).value();
        parts.forEach(part => {
            phoneme.add(part);
        });
        return phoneme;
    }

    public static withName(name: string): Phoneme {
        return new Phoneme(name);
    }
}
