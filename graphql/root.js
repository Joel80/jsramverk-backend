const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require('graphql');

const DocType = require('./doc.js');

const docsModel = require('../models/docs');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        docs : {
            type: new GraphQLList(DocType),
            description: 'List of documents',
            resolve: async function() {
                const docs = await docsModel.getAllDocs("jolf20@bth.se");
                return docs;
            }
        }
    })
});

module.exports = RootQueryType;