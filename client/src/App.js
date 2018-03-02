import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: '',
    balance: '0',
  };

  async componentDidMount() {
    const [manager, players, balance] = await Promise.all([
      lottery.methods.manager().call(),
      lottery.methods.getPlayers().call(),
      lottery.methods.getBalance().call(),
      web3.eth.getBalance(lottery.options.address),
    ]);

    this.setState({ manager, players, balance });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>

        <p>This contract is managed by: {this.state.manager}</p>
        <p>Currently participating playes: {this.state.players.length}</p>
        <p>To win: {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
      </div>
    );
  }
}

export default App;
