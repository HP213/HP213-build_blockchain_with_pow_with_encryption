const EthCrypto = require('eth-crypto');
const identity = EthCrypto.createIdentity();

console.log('public key :', identity.publicKey);
console.log('private key :', identity.privateKey);
console.log('address :', identity.address);
// const data = {
//                 "amount": 470,
//                 "address": "2d52e72608aae5c2b1d4d342e748c8cd4ee039b8a9896c038dfab9cad615e50a0d9e3b1c322962fb1b9677a76820d0f458d1678c5b7ad151d604ff93cff15cce"
//             }
async function getData(data, address){
  const encrypted = await EthCrypto.encryptWithPublicKey(
       address, // publicKey
      data.toString()// message
   );

   console.log("encrypted : ", encrypted);


   const message = await EthCrypto.decryptWithPrivateKey(
        identity.privateKey, // privateKey
        encrypted, // encrypted-data
        console.log("IN")
    );

    console.log(message);
  console.log(JSON.stringify(data));
  return encrypted;
}

// getData();
