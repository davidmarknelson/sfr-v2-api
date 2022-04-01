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

  static refreshTokenQuery(): {
    operationName: string;
    query: string;
  } {
    return {
      operationName: 'refreshToken',
      query: `query refreshToken {
        refreshToken {
          accessToken
        }
      }`,
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

  static updatePasswordMutation(password: string): {
    operationName: string;
    query: string;
    variables: {
      password: { password: string };
    };
  } {
    return {
      operationName: 'updatePassword',
      query: `mutation updatePassword($password: PasswordEditInput!) {
        updatePassword(password: $password) {
          message
        }
      }`,
      variables: {
        password: { password },
      },
    };
  }
}
