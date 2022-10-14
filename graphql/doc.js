const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql');

const DocType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
        _id:  { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        html: { type: new GraphQLNonNull(GraphQLString) },
        allowed_users: { type: new GraphQLList(GraphQLString) },
        code: { type: GraphQLBoolean },
        comments: { type: new GraphQLList(GraphQLString) }

    })
});

module.exports = DocType;
