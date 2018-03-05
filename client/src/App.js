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
    message: '',
    error: '',
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

    try {
      this.setState({ message: 'Verifying, please wait...' });
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether'),
      });
      this.setState({ message: 'You have succesfully entered lottery' });
    } catch (error) {
      this.setState({ error: 'Sorry, payment has been rejected :(' });
    }
  };

  handlePickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    try {
      this.setState({
        message: 'Picking winner and verifying, please wait...',
      });
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });

      const winner = await lottery.methods.winner().call();
      this.setState({
        message: `Winner has been picked. Funds will be transfered to: ${winner}`,
      });
    } catch (error) {
      this.setState({ error: 'Winner could not be picked.' });
    }
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

        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.handlePickWinner}>Pick a winner</button>
        <hr />

        <h2>{this.state.error || this.state.message}</h2>
      </div>
    );
  }
}

export default App;
