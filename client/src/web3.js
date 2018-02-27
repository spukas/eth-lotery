import Web3 from 'web3';

// Metamask browser extenction injects web3 object
// we need to use it's Provider
const web3 = new Web3(window.web3.currentProvider);

export default web3;
