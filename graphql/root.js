const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString
} = require('graphql');

const DocType = require('./doc.js');

const docsModel = require('../models/docs');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        docs: {
            type: new GraphQLList(DocType),
            description: 'List of documents',
            resolve: async function(root, args, context) {
                /* console.log("graph:");
                console.log(context); */
                const docs = await docsModel.getAllDocs(context.email);

                return docs;
            }
        },
        doc: {
            type: DocType,
            description: 'A document',
            args: {
                _id: { type: GraphQLString}
            },
            resolve: async function (parent, args) {
                const doc = await docsModel.getOneDocById(args._id)
            }
        }
    })
});

module.exports = RootQueryType;
