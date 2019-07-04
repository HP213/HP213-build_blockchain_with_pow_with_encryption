const Transaction = require('../wallet/transaction.js');
const Wallet = require('../wallet/index.js');

class Miners{
  constructor(blockchain, transactionPool, wallet, p2pserver){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pserver = p2pserver;
  }

  mine(){
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    // console.log("Valid transactoins are : ", validTransactions);
    const block = this.blockchain.addBlock(validTransactions);
    // console.log(this.blockchain.chain);
    this.p2pserver.syncChain();
    this.transactionPool.clear();
    this.p2pserver.broadcastClearMessage();

    return block;
  }
}
module.exports = Miners;
