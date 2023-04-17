//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// class PhonemeData
//
// Holds information on an individual type of phoneme (e.g.,
// "Consonant," "Vowel," "Nasal").
//-------------------------------------------------------------------

//===================================================================
// Description:  Constructor.
//-------------------------------------------------------------------
function PhonemeData(i_name) {
  this.m_Name = i_name;
  this.m_Elmts = new Array();
}

//===================================================================
// Description:
//
// Appends a new element to our list.
//-------------------------------------------------------------------
function PhonemeData_Add(i_elmt) {
  let asStr = new String(i_elmt);
  if (asStr.length === 0) {
    asStr = " ";
  }
  this.m_Elmts[this.m_Elmts.length] = asStr;
}

// Set up standard member functions.
PhonemeData.prototype.Add = PhonemeData_Add;


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// class TemplateData
//
// Holds information on an individual name template, which is
// an array of pointers to PhonemeData instances.
//-------------------------------------------------------------------

//===================================================================
// Description:  Constructor.
//-------------------------------------------------------------------
function TemplateData(i_name) {
  this.m_Name = i_name;
  this.m_Elmts = new Array();
  this.m_Caps = new Array();
}

//===================================================================
// Description:
//
// Appends a new phoneme to our list.
//-------------------------------------------------------------------
function TemplateData_Add(i_phone) {
  this.m_Elmts[this.m_Elmts.length] = i_phone;
}

//===================================================================
// Description:
//
// Appends a new phoneme to our list.
//-------------------------------------------------------------------
function TemplateData_AddCapAt(i_index) {
  this.m_Caps[i_index] = true;
}

// Set up standard member functions.
TemplateData.prototype.Add = TemplateData_Add;
TemplateData.prototype.AddCapAt = TemplateData_AddCapAt;


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// class NameData
//
// Holds information on phonemes and name templates used in
// building names.
//-------------------------------------------------------------------

//===================================================================
// Description:  Constructor.
//-------------------------------------------------------------------
function NameData() {
  this.m_Phonemes = new Array();
  this.m_Templates = new Array();
}

//===================================================================
// Description:
//
// Creates a new phoneme, add it to our list, and returns it.
//-------------------------------------------------------------------
function NameData_AddPhoneme(phoName) {
  let phData = new PhonemeData(phoName);
  this.m_Phonemes[phoName] = phData;
  return phData;
}

//===================================================================
// Description:
//
// Creates a new template, add it to our list, and returns it.
//-------------------------------------------------------------------
function NameData_AddTemplate(i_name) {
  let temp = new TemplateData(i_name);
  this.m_Templates[this.m_Templates.length] = temp;
  return temp;
}

//===================================================================
// Description:
//
// Finds and returns the phoneme data with the indicated name.
//-------------------------------------------------------------------
function NameData_GetPhoneme(phoName) {
  return this.m_Phonemes[phoName];
}


// Set up public methods for our object.
NameData.prototype.AddPhoneme  = NameData_AddPhoneme;
NameData.prototype.AddTemplate = NameData_AddTemplate;
NameData.prototype.GetPhoneme  = NameData_GetPhoneme;



//===================================================================
// Description:
//
// Reads name data from an XML document.
//-------------------------------------------------------------------
function ParseNameData(i_data) {
  const request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:8000/NameData.xml', false);
  request.send();

  if (request.status === 200) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(request.responseText, 'application/xml');

    const root = doc.documentElement;
    ParsePhonemes(root, i_data);
    ParseTemplates(root, i_data);
  } else {
    alert('Failed to name data XML.');
  }
}


//===================================================================
// Description:
//
// Reads all Phonemes from the XML root element.
//-------------------------------------------------------------------
function ParsePhonemes(i_root, i_data) {
  // Get all the individual phoneme entries.
  const temp = i_root.querySelector('PhonemeList');
  const allPhonemes = temp.querySelectorAll('Phoneme');

  // Parse each phoneme
  for (const xmlPhone of allPhonemes) {
    const phoneName = xmlPhone.attributes.getNamedItem('Name').value;
    let phoneData = i_data.AddPhoneme(phoneName);

    const allParts = xmlPhone.querySelectorAll('Part');
    for (const xmlPart of allParts) {
      phoneData.Add(xmlPart.textContent);
    }
  }
}

//===================================================================
// Description:
//
// Reads all name templates from the XML root element.
//-------------------------------------------------------------------
function ParseTemplates(i_root, i_data) {
  // Get all the individual phoneme entries.
  const temp = i_root.querySelector('NameTemplateList');
  const allTemplates = temp.querySelectorAll('NameTemplate');

  // Parse each template
  for (const template of allTemplates) {
    const templateName = template.attributes.getNamedItem('Name').value;
    let templateData = i_data.AddTemplate(templateName);

    // Parse each phoneme used by the current template.
    const allParts = template.querySelectorAll('Part');
    allParts.forEach((xmlPart, xmlPartIdx) => {
      const thePhoneme = i_data.GetPhoneme(xmlPart.textContent);
      templateData.Add(thePhoneme);

      // Some phonemes should be capitalized:
      if(xmlPart.attributes.getNamedItem('Type').value === 'Cap') {
        templateData.AddCapAt(xmlPartIdx);
      }
    });
  }
}


//===================================================================
// Description:
//
// Concatenate each of the phonemes used by this template into a
// single string.  Randomly select one element from each phoneme set.
//-------------------------------------------------------------------
function NameFromTemplate(theTemplate) {
  let theName = new String();

  // Concatenate each of the phonemes used by this template into a
  // single string.
  const parts = theTemplate.m_Elmts;
  parts.forEach((curPart, curPartIdx) => {
    // For this phoneme, choose an element randomly from it.
    const numElmts = curPart.m_Elmts.length;
    let randElmt = Math.random() * numElmts;
    randElmt = Math.floor(randElmt);
    if (randElmt === numElmts) {
      randElmt--;
    }

    const subName = curPart.m_Elmts[randElmt];
    if (theTemplate.m_Caps[curPartIdx] === true) {
      // Capitalize first letter of this element.
      var withCap = subName.substr(0, 1).toUpperCase();
      withCap += subName.substr(1, subName.length - 1);
      theName += withCap;
    } else {
      theName += subName;
    }
  });

  return theName;
}

//===================================================================
// Description:  
//
// Builds a set of names and places them into the argument array.
//-------------------------------------------------------------------
function BuildNames(i_data, i_whichTemplate, o_names) {
  // For every template.
  if (i_data.m_Templates.length <= i_whichTemplate) {
    alert('Bad template index.');
    return;
  }

  // Build several names from this template
  const elements = document.getElementsByName('NumToGenCtrl');
  if (elements.length === 0) {
    alert('Failed to read number of names to generate.');
    return;
  }
  var curTemplate = i_data.m_Templates[i_whichTemplate];
  var numToGen = elements.item(0).value;
  var j;
  for (j = 0; j < numToGen; j++) {
    o_names[o_names.length] = NameFromTemplate(curTemplate);
  }
}


var S_NameData;

//===================================================================
// Description:  Program entry point.
//-------------------------------------------------------------------
function Main() {
  S_NameData = new NameData;

  // Read parameters for how to construct names from data file
  ParseNameData(S_NameData);
}

//===================================================================
// Description:
//
// Generates new names using the currently selected template.
//-------------------------------------------------------------------
function OutputNames() {
  // Decide which name template to use.
  const elements = document.getElementsByName('TemplateChoice');
  if (elements.length === 0) {
    alert('Failed to read selected name template.');
    return;
  }
  const choiceCtrl = elements.item(0);
  const index = choiceCtrl.selectedIndex;

  // Build the names.
  let theNames = new Array();
  BuildNames(S_NameData, index, theNames);

  // Generate output
  const editCtrl = document.forms[0].elements['OutputArea'];
  editCtrl.value = '';
  for (const name of theNames) {
    editCtrl.value += `${name}\n`;
  }
}