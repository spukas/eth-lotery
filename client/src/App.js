import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: '',
    balance: '0',
    value: '',
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

  handleInputChange = event => this.setState({ value: event.target.value });

  handleSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    console.log({ accounts });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>

        <p>This contract is managed by: {this.state.manager}</p>
        <p>Currently participating playes: {this.state.players.length}</p>
        <p>To win: {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>

        <hr />

        <form onSubmit={this.handleSubmit}>
          <label>Amount of ether to enter</label>
          <input value={this.state.value} onChange={this.handleInputChange} />
          <button type="submit">Enter</button>
        </form>
      </div>
    );
  }
}

export default App;
