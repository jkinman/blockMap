import React from 'react';
import './app.scss';
import BlockPixel from './BlockPixel';
import BlockDetails from './BlockDetails';
import TransactionDetails from './TransactionDetails';
import EthereumSync from '../sources/EthereumSync';
import ReactTooltip from 'react-tooltip';
import PrimerImage from '../images/description.png';

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

const TransactionBlob = props => {

  return (
    <div 
      onMouseEnter={ () => props.toolTipCB( props.transaction ) } 
      onMouseLeave={ () => props.toolTipCB( false ) }
      onClick={ ()=> props.showTransactionDetails(props.transaction) }      
      className="TransactionBlob" data-tip={ `Transaction: ${props.transaction}` }>
      {props.pixels.map( (pixel) => 
      <DomPixel  pixel={pixel} /> )
      }
    </div>
  )
}

const DomPixel = props => {
  const { pixel, toolTipCB } = props;
  let pixelStyle = {
    color:`rgb(${pixel.r}, ${pixel.g}, ${pixel.b} )`,
    backgroundColor:`rgb(${pixel.r}, ${pixel.g}, ${pixel.b} )`,
  };

  return (
    <div className="DomPixel" style={pixelStyle} ></div>
  )
}
const BlockEnhanced = props => {

  return(
    <div className="block">
    <h1 onClick={ () => props.showBlock(props.block) } >{`Block # ${props.block.number}`}</h1>
    <div key={props.index} className="blockEnhanced">
      {props.block.pixelArray.map( (transaction, i) => 
      <TransactionBlob pixels={transaction} showTransactionDetails={props.showTransactionDetails} toolTipCB={ props.toolTipCB } transaction={props.block.transactions[i]} key={i} /> )}
    </div>
    </div>
    )
  }

const BlockDivs = props => {

  return(
    <div key={props.index}>
      {props.block.pixelArray.map( (pixel,y) => {
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

  componentDidMount(){
    // document.onmousemove( (event) => {
      window.addEventListener('mousemove', (event) => {
      let x = Math.max(0, event.clientX - 100);
      let y = event.clientY - 60;                    
      if ( typeof x !== 'undefined' ){
        this.refs.hoverInfo.style.left = x + "px";
        this.refs.hoverInfo.style.top = y + "px";
      }
    }
  )    
  }

  showTransactionDetails( transaction ) {

    this.props.ethereum.blockArray[0].loadTransaction( transaction )
    .then( (data) => {
      console.log(data)
    this.refs.TransactionDetails.open( data )
  })

  }

  showDetails( block ) {
    this.refs.blockDetails.open( block )
  }

  showToolTip( data ) {
    if( !data ){
      this.refs.hoverInfo.style.display = 'none'
    }
    else{
      this.refs.hoverInfo.innerText = data
      this.refs.hoverInfo.style.display = 'block'
    }
  }

  render() {
    
    return (
      <div className="index">
        <h1>Ethereum Blockchain Bitmap Visualization</h1>
        <h3>The transactions in every block are being concatenated and converted to RGB values and the result is being rendered to a bitmap.</h3>
        <h3>Click the blocks to inspect</h3>
        <img src={PrimerImage} className="primer"/>
        <h3>Each group of squares represents one transaction, each group of transactions is a block.</h3>
        
        <p ref="data"></p>
        <div className="transtooltip" ref="hoverInfo">hover</div>

        <div className="blockContainer">
          { this.props.ethereum && 
            this.props.ethereum.blockArray.map( 
              (block, i) => {
                return (
                <div key={i} >
                
                  <BlockEnhanced
                  showBlock={ this.showDetails.bind(this) }
                  showTransactionDetails={this.showTransactionDetails.bind(this)}
                  toolTipCB={ this.showToolTip.bind(this) } 
                  block={block} 
                  tilt={this.state.hoverId == i} 
                  index={i} key={i+'block'} />
                  {/* <Block block={block} tilt={this.state.hoverId == i} index={i} key={i+'block'} /> */}
                </div>
                )
              }
            )}
        </div>
          <BlockDetails ref="blockDetails" />
          <TransactionDetails ref="TransactionDetails" />
          <ReactTooltip />
        {/* <div ref="blockDetails" ></div> */}
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
