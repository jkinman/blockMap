import React from 'react';
import './app.scss';

const SIZE = 5

class TransactionDetails extends React.Component {
 
  constructor(props,c) {

    super(props,c)
    this.state = {visible:false}

  }

  componentDidMount() {
    document.addEventListener('click', this.close.bind(this))
  }

  open( transaction ) {
    this.setState( {visible: true, transaction})
  }

  close() {
    this.setState( {visible: false})
  }

  render() {
    let showPanel = this.state.visible 
    return(
      <div>
       { showPanel &&
        <div className="blockDetails">
        <h1>Transaction Details</h1>
        <p>blockHash: {this.state.transaction.blockHash}</p>
        <p>from: {this.state.transaction.from}</p>
        <p>to: {this.state.transaction.to}</p>
        <p>gas: {this.state.transaction.gas}</p>
        <p>gasPrice: {this.state.transaction.gasPrice}</p>
        <p>r: {this.state.transaction.r}</p>
        <p>s: {this.state.transaction.s}</p>
        <p>transactionIndex: {this.state.transaction.transactionIndex}</p>
        <p>v: {this.state.transaction.v}</p>
        <p>value: {this.state.transaction.value}</p>
        </div>
      }
      </div>
    )
  }

}

export default TransactionDetails;
