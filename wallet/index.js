//This represents wallet of user

const { INITAL_BALANCE } = require('../difficulty');
const ChainUtil = require('../chain-util.js');
const Transaction = require('./transaction.js');
class Wallet{
  constructor(){
    this.balance = INITAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex'); //encode('hex')used to convert given no. into hexadecimal form
  }

  toString(){
    return `Wallet -
    publicKey : ${this.publicKey.toString()}
    balance   : ${this.balance}`
  }   //return in above format

  sign(dataHash){
    return this.keyPair.sign(dataHash);
  } // Sign the transaction.

  createTransaction(recipient, amount, blockchain, transactionPool, publicKey){
    this.balance = this.calculateBalance(blockchain);

    if(amount > this.balance){
      console.log(`Amount ${amount} exceeds the wallet balance`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if(transaction){
      transaction.update(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }else{
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }
    return transaction;
  }

  calculateBalance(blockchain){
    let balance = this.balance;
    let transactions = [];

    blockchain.chain.forEach(block => block.data.forEach(transaction => {
      transactions.push(transaction);
    }));

    const walletInput = transactions.filter(transaction => transaction.input.address === this.publicKey);

    let startTime = 0;

    if(walletInput.length){
      const recentInput = walletInput.reduce(
        (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
      );

      balance = recentInput.outputs.find(output => output.address === this.publicKey).amount;
      startTime = recentInput.input.timestamp;
    }

    transactions.forEach(transaction => {
      if(transaction.input.timestamp > startTime){
        transaction.outputs.find(output=>{
          if(output.address === this.publicKey){
            balance += output.amount;
          }
        })
      }
    })
    return balance;
  }

  static blockchainWallet(){
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-walllet';
    return blockchainWallet;
  }
}
module.exports = Wallet;
