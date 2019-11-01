import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Library from './components/Library/Library';

import { routes } from './routes';

class App extends Component {
  state = {
    
  }

  componentDidMount(){

  }
  
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div style={{ backgroundColor: "#272b30", height: "100vh" }}>
            <Switch>
              { routes.map(({ path, component }) => (
                <Route path={path}>
                  { component }
                </Route>
              )) }
            </Switch>
            {/* <Library></Library> */}
          </div>
        </BrowserRouter>
      </Provider>
      
    );
  }
}

export default App;
