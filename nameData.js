const xsltproc = require('node-xsltproc');

xsltproc({xsltproc_path: '/usr/bin'}).transform(['./NameData.xslt', './NameData.xml']).then((data) => {
  try {
    let initialData = JSON.parse(data.result);
    console.log(JSON.stringify(initialData, null, 2));
  }
  catch(err) {
    console.log('Failed to load initial data:', err.message);
  }
}, (reason) => {
  console.log('Rejected:', reason.message);
});
