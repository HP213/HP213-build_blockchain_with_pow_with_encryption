const Transaction = require('./transaction.js');
const EthCrypto = require('eth-crypto');
// const test = require('../test.js');

async function call(transaction){
  transaction = await EthCrypto.encryptWithPublicKey(
  transaction.address, // publicKey
  transaction.toString() // message
  )
  return transaction;
}

class TransactionPool{
  constructor(){
    this.transactions = [];
  }

  updateOrAddTransaction(transaction){
    let transactionWithId = this.transactions.find(t => t.id == transaction.id);

    if(transactionWithId){
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    }else{
      this.transactions.push(transaction);
    }
  }

  existingTransaction(publicKey){
    return this.transactions.find(t => t.input.address === publicKey);
  };

  static encrypt(transaction){
    console.log("Hi");
    transaction = EthCrypto.encryptWithPublicKey(
    transaction.address, // publicKey
    transaction.toString() // message
    )

    return transaction;
  }

  validTransactions(){
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if(transaction.input.amount !== outputTotal){
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }

      if(!Transaction.verifyTransaction(transaction)){
        console.log(`Invalid signature from ${transaction.input.address}.`);
        return;
      }

      transaction.outputs.forEach(outputData => {
        call(outputData).then(data =>{
          const inputData = [data];
          // console.log(outputData.address.toString());
          const address =  EthCrypto.publicKey.toAddress(outputData.address.toString());
          // console.log(address);
          inputData.push({address})
          transaction.outputs[transaction.outputs.indexOf(outputData)] = inputData;
        });
      })
      return transaction;
    });
  }

  clear(){
    this.transactions = [];
  }
}


module.exports = TransactionPool;
