import React from 'react';
import YeomanImage from './YeomanImage';
import './app.css';
import Web3 from 'web3';

const ETHERIUM_ENDPOINT = 'https://mainnet.infura.io/mRUmnxLJW2t5fZP6WfDN';
let web3;
const SIZE = 10

const BlockPixel = props => {
  let lineLength = Math.round(Math.sqrt(props.block.bitmap.length))

  return(
    <div key={props.index}>
    {props.block.bitmap.map( (pixel,y) => {
        let pixelStyle = {
          color:pixel,
          backgroundColor:pixel,
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

const BlockSvgPixel = props => {
  let lineLength = Math.round(Math.sqrt(props.block.bitmap.length))

  return(
    <div key={props.index}>
    {props.block.bitmap.map( (pixel,y) => {
      // debugger;
        let pixelStyle = {
          color:pixel,
          backgroundColor:pixel,
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

    // const MyContract = window.web3.eth.contract();

    // this.state = {
    //   ContractInstance: MyContract.at('')
    // }
    this.state = {
      latestBlock: {},
      blockNumber:0,
      blockArray:[],
  }
  // web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

    // web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
    web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/mRUmnxLJW2t5fZP6WfDN'));
    this.makeBlockChainEvents()

  }

  makePixelsFromHexString( hash ){

    let trimmedHash
    if( hash.indexOf('0x') == 0) {
      trimmedHash = hash.substring( 2, hash.length)
    }
    else {
      trimmedHash = hash;
    }
    
    let bitmap = [];
    let i = 0;
    while( i < trimmedHash.length -6) {
      let colourString = `#${trimmedHash.substring( i, i +6 )}`
      let rgb = this.hexToRgb(colourString)
      let colour = this.roundColours( rgb)
      bitmap.push( colour )
      i = i + 6
    }
    return bitmap
  }

  roundColours( colour, power = 10 ) {
    colour.r = (parseInt(colour.r/power, power)+1)*power
    colour.g = (parseInt(colour.g/power, power)+1)*power
    colour.b = (parseInt(colour.b/power, power)+1)*power
    return colour
  }

  hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

      return result ? {
          r: parseInt(result[1], 16) ,
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }

  convertBlockToRGB( block ) {

    let bitmap = [];
    block.transactions.map( (transaction) => {
      let pixelArray = this.makePixelsFromHexString(transaction);
      bitmap = [...bitmap, ...pixelArray]
    })

    return bitmap
  }

  makeBlockImage( pixels ){
    const SCALE = 20
    let dimentions = Math.round(Math.sqrt(pixels.length))
    let canvas = document.createElement("canvas")
    canvas.width = dimentions * SCALE
    canvas.height = dimentions * SCALE
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, dimentions * SCALE, dimentions * SCALE)
    
    let x = 0
    let y = 0

    pixels.map((pixel, i) => {
      if( x == dimentions && y == dimentions ) return;

      if( x > dimentions ) {
        x = 0
        y++
      }
      else{
        x++
      }

      ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b} )`
      ctx.fillRect(x * SCALE, y * SCALE, 1 * SCALE, 1 * SCALE)
    })

    return canvas.toDataURL();

  }

  makeBlockChainEvents() {
    setTimeout( this.makeBlockChainEvents.bind(this), 3000 )
    if( !web3.eth ) return
    
    web3.eth.getBlockNumber()
    .then((data) => {
        if( this.state.blockNumber !== data){
            var currBlockObj = web3.eth.getBlock(data)
            .then( (block) => {
                if(!block) return
                block.pixels = this.convertBlockToRGB(block)
                block.image = this.makeBlockImage( this.convertBlockToRGB(block) )
                this.setState({blockArray: [...this.state.blockArray, block], latestBlock: block})
            })
            .error(console.error)            
        }
        this.setState({blockNumber: data})
    })
    .error(console.error)    
  }


  render() {
    
    return (
      <div className="index">
      <h1>Block Chain Bitmap Visualization</h1>
      <div className="blockContainer">
        { this.state.blockArray && 
          this.state.blockArray.map( 
            // (block, i) => <BlockPixel block={block} index={i} key={i}/>
            (block, i) => 
            <div className="block" key={i}>
              <h1>{block.hash}</h1>
              <img src={block.image} className="blockImage" />
            </div>
            
            )}
      </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
