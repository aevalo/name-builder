const xsltproc = require('node-xsltproc');
const jsonfile = require('jsonfile');
const fs = require('fs');

const xmlFile = `${__dirname}/data/xml/NameData.xml`;
const xsltFile = `${__dirname}/data/xml/NameData.xslt`;
xsltproc({xsltproc_path: '/usr/bin'}).transform([xsltFile, xmlFile]).then((data) => {
  try {
    fs.mkdir(`${__dirname}/data/json`, { recursive: true }, (err) => {
      if (err) throw err;
      let nameData = JSON.parse(data.result);
      const jsonFile = `${__dirname}/data/json/namedata.json`;
      jsonfile.writeFile(jsonFile, nameData).catch(error => console.error(error.message));
    });
  }
  catch(err) {
    console.error('Failed to load initial data:', err.message);
  }
}, (reason) => {
  console.error('Failed to transform XML:', reason.message);
});
