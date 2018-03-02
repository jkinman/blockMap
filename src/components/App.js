import React from 'react';
import YeomanImage from './YeomanImage';
import './app.css';

class AppComponent extends React.Component {

  render() {
    return (
      <div className="index">
        <YeomanImage />
        <div className="notice">
        
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
