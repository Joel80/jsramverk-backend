const {
    GraphQLObjectType,
    GraphQLString,
} = require('graphql');

const DocType = require('./doc.js');

const DocInputType = require('./docInput.js');

const docsModel = require('../models/docs');

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        saveDoc: {
            type: GraphQLString,
            description: 'Saving a new doc',
            args: {
                doc: { type: DocInputType }
            },
            resolve: async function(parent, args) {
                /* console.log("graph:");
                console.log(context); */
                console.log(`Before function call: ${args.doc._id}`);
                const result = await docsModel.saveDoc(args.doc);

                console.log(`Result: ${result.insertedId}`);

                console.log(`After function call: ${args.doc._id}`);

                return result.insertedId;
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
