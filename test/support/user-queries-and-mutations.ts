export class UserQueriesAndMutations {
  static graphqlEndpoint = '/graphql';
  static userQuery(): {
    operationName: string;
    query: string;
  } {
    return {
      operationName: 'user',
      query: `query user {
        user {
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
