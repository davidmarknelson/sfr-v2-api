export class UserQueriesAndMutations {
  static graphqlEndpoint = '/graphql';
  static profileQuery(): {
    operationName: string;
    query: string;
  } {
    return {
      operationName: 'profile',
      query: `query profile {
        profile {
          id
          email
          username
          recipes {
            id
          }
        }
      }`,
    };
  }
}
