export class AuthQueriesAndMutations {
  static graphqlEndpoint = '/graphql';
  static loginQuery(
    email: string,
    password: string,
  ): {
    operationName: string;
    query: string;
    variables: {
      email: string;
      password: string;
    };
  } {
    return {
      operationName: 'login',
      query: `query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
        }
      }`,
      variables: {
        email,
        password,
      },
    };
  }

  static signupMutation(
    email: string,
    password: string,
    username: string,
  ): {
    operationName: string;
    query: string;
    variables: {
      user: { email: string; password: string; username: string };
    };
  } {
    return {
      operationName: 'signup',
      query: `mutation signup($user: UserInput!) {
        signup(user: $user) {
          accessToken
        }
      }`,
      variables: {
        user: { email, password, username },
      },
    };
  }
}
