import React from 'react';
import './app.scss';

const SIZE = 5

class BlockDetails extends React.Component {
 
  constructor(props,c) {

    super(props,c)
    this.state = {visible:false}

  }

  componentDidMount() {
    document.addEventListener('click', this.close.bind(this))
  }

  open( block ) {
    this.setState( {visible: true, block})
  }

  close() {
    this.setState( {visible: false})
  }

  render() {
    let showPanel = this.state.visible && this.state.block
    return(
      <div>
        { showPanel &&
        <div className="blockDetails">
        <h1>Details</h1>
        <h2>block #{this.state.block.number}</h2>
        <img src={this.state.block.image} className="blockImageFlat" />
        <h2>difficulty:{this.state.block.difficulty}</h2>
        <h2>extraData:{this.state.block.extraData}</h2>
        <h2>nonce:{this.state.block.nonce}</h2>
        <h2>miner:{this.state.block.miner}</h2>
        <h2>difficulty:{this.state.block.difficulty}</h2>
        <h2>size:{this.state.block.size}</h2>
        <h2>transactions:</h2>
        <ul>
          {this.state.block.transactions.map((transaction) => 
          <li><a href={"https://etherscan.io/tx/" + transaction} target="_blank">{transaction}</a></li>)}
        </ul>
        
        </div>
      }
      </div>
    )
  }

}

export default BlockDetails;
