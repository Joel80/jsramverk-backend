const {
    GraphQLObjectType,
} = require('graphql');

const DocType = require('./doc.js');

const DocInputType = require('./docInput.js');

const docsModel = require('../models/docs');

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        saveDoc: {
            type: DocType,
            description: 'Saving a new doc',
            args: {
                doc: { type: DocInputType }
            },
            resolve: async function(parent, args) {
                /* console.log("graph:");
                console.log(context); */
                await docsModel.saveDoc(args.doc);

                return args.doc; 
            }
        },
        updateDoc: {
            type: DocType,
            description: 'Update a doc',
            args: {
                doc: { type: DocInputType }
            },
            resolve: async function (parent, args) {
              await docsModel.updateDoc(args.doc);

              return args.doc;
            }
        }
    })
});

module.exports = RootMutationType;
