const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql');

const DocInputType = new GraphQLInputObjectType({
    name: 'DocumentInput',
    description: 'This represents a document',
    fields: () => ({
        _id:  { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString) },
        html: { type: new GraphQLNonNull(GraphQLString) },
        allowed_users: { type: new GraphQLList(GraphQLString) },
        code: { type: GraphQLBoolean },
        comments: { type: new GraphQLList(GraphQLString) }

    })
});

module.exports = DocInputType;
