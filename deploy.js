const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'version fold actor render decrease good figure merry render hundred dose indoor',
  'https://rinkeby.infura.io/HfQdjgWWudJBNx0VUPe2',
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Atempt to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hello there!'] })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('contract deployed to', result.options.address);
};

deploy();
