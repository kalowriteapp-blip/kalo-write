import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getGraphQLUrl } from './config';

const httpLink = createHttpLink({
  uri: getGraphQLUrl(),
});

const authLink = setContext((_, { headers }) => {
  // Only access localStorage on client side to avoid hydration issues
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }: any) => {
  console.log('[Apollo Error Link] Operation:', operation?.operationName, 'Variables:', operation?.variables);
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }: any) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`, 
        'Extensions:', extensions
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError);
    console.error(`[Network error details]:`, JSON.stringify(networkError, null, 2));
    
    // Handle 401 errors by clearing the token
    if ('statusCode' in networkError && (networkError as any).statusCode === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.reload();
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]), // Temporarily removed errorLink
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
