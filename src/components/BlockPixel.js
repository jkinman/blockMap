import React from 'react';
import './app.scss';

const SIZE = 5

class BlockPixel extends React.Component {

    showInfo(e) {
        this.refs.info.textContent = 
        `
        difficulty: ${this.props.block.difficulty}
        gas limit: ${this.props.block.gasLimit}
        `
    }

    render() {

        return(
            <div>
            <p ref="info">info</p>
            <div key={this.props.index} className="blockContainer">
              { this.props.block.pixels.map( (pixel,y) => {
                  let pixelStyle = {
                    color:`rgb(${pixel.r}, ${pixel.g}, ${pixel.b} )`,
                    backgroundColor:`rgb(${pixel.r}, ${pixel.g}, ${pixel.b} )`,
                    width:SIZE,
                    height:SIZE,
                  };
                  return ( <div style={pixelStyle} onMouseEnter={this.showInfo.bind(this)} key={y} className="block"></div>)
                })
              }
            </div>
            </div>
          )
        
    }
}

export default BlockPixel;
