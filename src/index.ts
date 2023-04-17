import { NameData } from './NameData';
import { buildNames } from './utils';

const nameDataXML: unknown = require('./NameData.xml');
let nameData: NameData = null;

addEventListener("load", (event) => {
    nameData = NameData.from(nameDataXML);

    const templateChoiceCtrl: HTMLElement = document.getElementById('TemplateChoice');
    if (templateChoiceCtrl !== null) {
        nameData.templates.forEach(template => {
            templateChoiceCtrl.appendChild(new Option(template.name));
        });
    }
});

export function handleGenerateNames(event: Event): void {
    // Decide which name template to use.
    const choiceCtrl: HTMLSelectElement = document.getElementById('TemplateChoice') as HTMLSelectElement;
    if (choiceCtrl !== null) {
        const templateIndex: number = choiceCtrl.selectedIndex;
        const numToGenCtrl: HTMLInputElement = document.getElementById('NumToGenCtrl') as HTMLInputElement;
        if (numToGenCtrl !== null) {
            const numToGen: number = parseInt(numToGenCtrl.value);
            const editorCtrl: HTMLTextAreaElement = document.getElementById('OutputArea') as HTMLTextAreaElement;
            if (editorCtrl !== null) {
                editorCtrl.value = '';
                const names: string[] = buildNames(nameData, templateIndex, numToGen);
                for (const name of names) {
                    editorCtrl.value += `${name}\n`;
                }
            }
        }
    }
}