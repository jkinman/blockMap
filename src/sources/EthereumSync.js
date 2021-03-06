import Web3 from 'web3';

class EthereumSync {

    constructor( addBlock ) {
        this.addBlock = addBlock
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/mRUmnxLJW2t5fZP6WfDN'));
        this.pollEthereum()
    }

    pollEthereum() {
        setTimeout( this.pollEthereum.bind(this), 4000 )
        if( !this.web3.eth ) return
        
        this.web3.eth.getBlockNumber()
        .then( (data) => {
          if( !this.blockNumber ){
            for( let i = data - 3 ; i < data ; i++ ) {
              this.processBlock(i)
            }
          }
          else if( this.blockNumber !== data) this.processBlock(data)
        })
        .error(console.error)    

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
          bitmap.push( rgb )
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
    
      convertBlockToRGB( block, returnTrans=false ) {
    
        let bitmap = [];
        let transactionArray = []
        block.transactions.map( (transaction) => {
          let pixelArray = this.makePixelsFromHexString(transaction);
          bitmap = [...bitmap, ...pixelArray]
          transactionArray.push( pixelArray )
        })
        
        if(returnTrans) return transactionArray
        return bitmap
      }
    
      makeBlockImage( pixels ){
        const SCALE = 20
        let dimentions = Math.round(Math.sqrt(pixels.length))
        let canvas = document.createElement("canvas")
        canvas.width = dimentions * SCALE
        canvas.height = dimentions * SCALE
        let ctx = canvas.getContext('2d');
        ctx.width = dimentions * SCALE
        ctx.height = dimentions * SCALE
    
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
    
        // let filteredData = Filters.filterCanvas( Filters.grayscale, ctx)
        // let filteredData = Filters.filterCanvas( Filters.threshold, ctx, 100)
        // ctx.putImageData(filteredData, 0, 0);
        return canvas.toDataURL();
    
      }
    
      loadTransactions( block ) {
        let retVal = []
        block.transactions.map( (transaction) => {
          this.web3.eth.getTransaction(transaction, (err, data) => {
            if( err ){
              console.error( err )
              return
            }
            retVal.push( data )
          })
        })
        return retVal
      }

      loadTransaction( transaction, outVal ) {
        return this.web3.eth.getTransaction(transaction)
      }
    
      processBlock (data) {
        this.blockNumber = data
        
        var currBlockObj = this.web3.eth.getBlock(data)
        .then( (block) => {
            if(!block) return
            // let pixels = this.convertBlockToRGB(block)
            // block.image = this.makeBlockImage( pixels )
            block.pixelArray = this.convertBlockToRGB(block, true)
            block.loadTransaction = this.loadTransaction.bind(this)
            this.addBlock( block )
        })
        .error(console.error)       
      }
    
}

export default EthereumSync;