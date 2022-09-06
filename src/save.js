const documentModel = require('../models/docs');

save();

async function save() {
    await documentModel.saveDoc({name: "Nytt dokument", html: "<h1>Nytt dokument</h1>"})

}

