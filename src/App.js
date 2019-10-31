import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import Library from './components/Library';

class App extends Component {
  state = {
    
  }

  componentDidMount(){

  }
  
  render() {
    return (
      <Provider store={store}>
        <div style={{ backgroundColor: "#272b30", height: "100vh" }}>
          {/* <h1>Welcome to Electron with React</h1>
          <p>Communicate with Main Process:</p>
          <div>{this.state.count}</div>
          <button onClick={this.onButtonClick}>Click me!</button>
          <button onClick={this.onIncCountClick}>Inc count</button>
          <img src="file:///G:/ProjectsRelatedData/DuoReader/manga/test.jpg" />
          <p>Message from server: {this.state.msgFromMainProcess}</p> */}
          <Library></Library>
        </div>
      </Provider>
      
    );
  }
}

export default App;
