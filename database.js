import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInterfaceType
} from 'graphql';

const humans = [
        {id :'1', name: 'Luke', description: 'Anakins son', friends : ['2'] },
        {id :'2', name: 'Darth', description: 'Anakin', friends : ['3'] },
        {id :'3', name: 'Palpatine', description: 'Anakins master', friends : [] }
    ];

function getHuman(id) {
    console.log('get human',id);
    var result = humans.filter( h => h.id === id );
    if(result.length > 0) { return Promise.resolve( result[0] ); }
    else return Promise.resolve( {} );
}

function getHumans() {
    return Promise.resolve( humans.map( h => h));
}

function getOneHuman() {
    return Promise.resolve({
        id: "4", name: 'Yoda', description : 'muppet', friends : ["1"]
    })
}

function getFriends(character) {
    console.log('friends',character.friends);
    return character.friends.map( f => getHuman(f) );
}

const characterInterface = new GraphQLInterfaceType({
  name: 'Character',
  fields : () => ({
      id: { type: GraphQLString },
      name : { type : GraphQLString },
      description : { type : GraphQLString },
      friends : { type: new GraphQLList(characterInterface) }
  }),
  resolveType(character) {
    return humanType;
  }
});

var humanType = new GraphQLObjectType({
    name : 'Human',
    fields : () => ({
        id: { type: GraphQLString },
        description : { type : GraphQLString, description : 'desc' },
        name  : { type : GraphQLString, description : 'name of person' },
        friends : { 
            type: new GraphQLList(characterInterface),
            resolve : human => getFriends( human ) 
        }
    }),
    interfaces : [ characterInterface ]
})

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      },
      who : {
          type: GraphQLString,
          resolve() {
              return 'chris';
          }
      },
      oneHuman : {
          type: humanType,
          resolve: () => getOneHuman()
      },
      human : {
          type : humanType,
          args : {
             id: {
                 description: 'id of the jedi',
                 type: new GraphQLNonNull(GraphQLString)
             } 
          },
          resolve: (root, { id }) => getHuman(id)
      },
      humans : {
          type: new GraphQLList(characterInterface),
          resolve : (root, {}) => {
              return humans;
              //return getHumans().then( res => {
              //  console.log('res',res);
              //  return res;
              //})
        }
      }
    }
  }),
  types : [ humanType ]
});

export default schema;