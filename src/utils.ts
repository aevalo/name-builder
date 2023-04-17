import _ from 'lodash';
import { NameData } from "./NameData";
import { Phoneme } from "./Phoneme";
import { NameTemplate } from "./NameTemplate";

//===================================================================
// Description:
//
// Concatenate each of the phonemes used by this template into a
// single string.  Randomly select one element from each phoneme set.
//-------------------------------------------------------------------
function nameFromTemplate(template: NameTemplate): string {
  let theName = new String();

  // Concatenate each of the phonemes used by this template into a
  // single string.
  const parts: Phoneme[] = template.elements;
  parts.forEach((curPart, curPartIdx) => {
    // For this phoneme, choose an element randomly from it.
    const numElmts: number = curPart.elements.length;
    let randElmt: number = Math.random() * numElmts;
    randElmt = Math.floor(randElmt);
    if (randElmt === numElmts) {
      randElmt--;
    }

    const subName: string = curPart.elements[randElmt];
    if (template.caps[curPartIdx]) {
      // Capitalize first letter of this element.
      theName += _.capitalize(subName);
    } else {
      theName += subName;
    }
  });

  return theName.toString();
}

//===================================================================
// Description:
//
// Generates new names using the currently selected template.
//-------------------------------------------------------------------
export function buildNames(nameData: NameData, templateIndex: number, numNames: number): string[] {
  // For every template.
  if (nameData.templates.length <= templateIndex) {
    throw new RangeError('Bad template index.');
  }

  // Build the names.
  let names: string[] = [];
  const curTemplate: NameTemplate = nameData.templates[templateIndex];
  let j = 0;
  for (; j < numNames; j++) {
    names.push(nameFromTemplate(curTemplate));
  }
  return names;
}
