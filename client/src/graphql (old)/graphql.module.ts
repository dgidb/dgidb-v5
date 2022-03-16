export {}

// import { HttpLink } from '@apollo/client';
// import { ApolloClient, ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
// import { PossibleTypesMap, TypePolicies } from '@apollo/client/cache';
// import { CvcTypePolicies } from  './graphql.type-policies';

// import {
//   default as result,
//   IntrospectionResultData,
// } from '@app/generated/server.possible-types';

// const uri = '/api/graphql'; // <-- add the URL of the GraphQL server here

// const typePolicies: TypePolicies = CvcTypePolicies;

// export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
//   return {
//     link: new HttpLink({ uri: uri, credentials: 'include' }),
//     cache: new InMemoryCache({
//       possibleTypes: introspectionToPossibleTypes(result),
//       typePolicies: typePolicies
//     }),
//     defaultOptions: {
//       watchQuery: {
//         fetchPolicy: 'cache-first',
//         errorPolicy: 'all',
//         notifyOnNetworkStatusChange: false,
//       },
//     },
//   };
// }

// export class GraphQLModule {}

// const introspectionToPossibleTypes = (
//   introspectionResultData: IntrospectionResultData
// ): PossibleTypesMap => {
//   const possibleTypes: PossibleTypesMap = {};

//   introspectionResultData.__schema.types.forEach((supertype) => {
//     if (supertype.possibleTypes) {
//       possibleTypes[supertype.name] = supertype.possibleTypes.map((subtype) => {
//         return subtype.name;
//       });
//     }
//   });

//   return possibleTypes;
// };

// // import { NgModule } from '@angular/core';
// // import { HttpLink } from 'apollo-angular/http';

// // import { APOLLO_OPTIONS } from 'apollo-angular';
// // import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
// // import { PossibleTypesMap, TypePolicies } from '@apollo/client/cache';
// // import { CvcTypePolicies } from  './graphql.type-policies';

// // import {
// //   default as result,
// //   IntrospectionResultData,
// // } from '@app/generated/server.possible-types';

// // const uri = '/api/graphql'; // <-- add the URL of the GraphQL server here

// // const typePolicies: TypePolicies = CvcTypePolicies;

// // export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
// //   return {
// //     link: httpLink.create({ uri: uri, withCredentials: true }),
// //     cache: new InMemoryCache({
// //       possibleTypes: introspectionToPossibleTypes(result),
// //       typePolicies: typePolicies
// //     }),
// //     defaultOptions: {
// //       watchQuery: {
// //         fetchPolicy: 'cache-first',
// //         errorPolicy: 'all',
// //         notifyOnNetworkStatusChange: false,
// //       },
// //     },
// //   };
// // }

// // @NgModule({
// //   providers: [
// //     {
// //       provide: APOLLO_OPTIONS,
// //       useFactory: createApollo,
// //       deps: [HttpLink],
// //     },
// //   ],
// // })
// // export class GraphQLModule {}

// // /**
// //  * Extracts `PossibleTypesMap` as accepted by `@apollo/client` from GraphQL introspection query result. From: https://github.com/apollographql/apollo-client/issues/6855
// //  */
// // const introspectionToPossibleTypes = (
// //   introspectionResultData: IntrospectionResultData
// // ): PossibleTypesMap => {
// //   const possibleTypes: PossibleTypesMap = {};

// //   introspectionResultData.__schema.types.forEach((supertype) => {
// //     if (supertype.possibleTypes) {
// //       possibleTypes[supertype.name] = supertype.possibleTypes.map((subtype) => {
// //         return subtype.name;
// //       });
// //     }
// //   });

// //   return possibleTypes;
// // };

// // export default introspectionToPossibleTypes;
