import React from 'react';
import './app.scss';
import BlockPixel from './BlockPixel';
import BlockDetails from './BlockDetails';
import EthereumSync from '../sources/EthereumSync';

const SIZE = 5

const Block = props => {

  return(
    <div className="block" key={props.index}>
       <h1>{`Block # ${props.block.number}`}</h1>
      {/*<h2>{props.block.hash}</h2> */}
      <img 
        src={props.block.image} 
        className={ props.tilt ? 'blockImage tilt' : 'blockImage'}
        alt={`Block Number: ${props.block.number}`}/>
    </div>
    )
}

const BlockSvgPixel = props => {

  return(
    <div key={props.index}>
    {props.block.pixels.map( (pixel,y) => {
        let pixelStyle = {
          color:`rgb(${pixel.r}, ${pixel.g}, ${pixel.b} )`,
          backgroundColor:`rgb(${pixel.r}, ${pixel.g}, ${pixel.b} )`,
          width:SIZE,
          height:SIZE,
          position:'fixed',
          top: Math.round(y / lineLength) * SIZE,
          left: (y % lineLength) * SIZE,
        };
        return( <div style={pixelStyle} key={y}></div>)
      })
    }
  </div>
  )
}

class AppComponent extends React.Component {
  constructor( props, context) {
    super( props, context );
    this.ethereumSync = new EthereumSync( this.props.actions.addNewBlock )
    this.state = {
      latestBlock: {},
      blockNumber:0,
      blockArray:[],
  }

  }

  showDetails( block ) {
    this.refs.blockDetails.open( block )
  }

  render() {
    
    return (
      <div className="index">
        <h1>Ethereum Blockchain Bitmap Visualization</h1>
        <h3>The transactions in every block are being concatenated and converted to RGB values and the result is being rendered to a bitmap.</h3>
        <h3>Click the blocks to inspect</h3>
        <p ref="data"></p>
        <div className="blockContainer">
          { this.props.ethereum && 
            this.props.ethereum.blockArray.map( 
              (block, i) => {
                return (
                <div key={i} 
                onClick={ ()=>this.showDetails(block) }
                onMouseEnter={ ()=> {
                  console.log( `hover on ${i}`)
                  this.setState({ hoverId : i})
                } }
                >
                  <Block block={block} tilt={this.state.hoverId == i} index={i} key={i+'block'} />
                </div>
                )
              }
            )}
        </div>
          <BlockDetails ref="blockDetails" />
        {/* <div ref="blockDetails" ></div> */}
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
