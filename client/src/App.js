import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import {ApolloProvider, ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client'
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const httpLinkup = createHttpLink({
  url: '/graphql'
});

// Retrieve the user token from localStorage
const token = localStorage.getItem('id_token');

// Create a new Apollo Client link using the setContext function
const auth = setContext((_, { headers }) => {
  // Check if a token exists in localStorage
  if (token) {
    // If a token is found, add it to the authorization header with the 'Bearer' prefix
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` :'' // 'Bearer' prefix is added to the token if it exists
      },
    };
  } else {
    // If no token is found, return the headers without any modification
    return {
      headers,
    };
  }
});

const client = new ApolloClient({
 link: auth.concat(httpLinkup), 
  cache: new InMemoryCache(),
});



function App() {
  return (
    <ApolloProvider client ={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
