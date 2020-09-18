import React, { Component } from "react";
import EtherTrustContract from "./contracts/EtherTrust.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

import {
  Route,
  //NavLink,
  HashRouter
} from "react-router-dom";

import MainBar from "./components/MainBar/MainBar";

import Main from "./components/Main/Main";

import Stats from "./components/Stats/Stats";

import About from "./components/About/About";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EtherTrustContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EtherTrustContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      web3.currentProvider.publicConfigStore.on('update', function(event){
        var a = accounts[0].toString().toLowerCase() ;
        var b = event.selectedAddress.toString().toLowerCase();
        if(a !== b){
          //console.error(a + "\n" + b);
          window.location.reload();
        }
    });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };





  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <HashRouter>
          <MainBar {...this.state}/>
          <Route exact path="/" render = {(routeProps)=>(<Main {...routeProps} {...this.state}/>)}/> 
          <Route exact path="/Stats" render = {(routeProps)=>(<Stats {...routeProps} {...this.state}/>)}/>
          <Route exact path="/About" render = {(routeProps)=>(<About {...routeProps} {...this.state}/>)}/>
        </HashRouter>
        <p id="copyright">&copy; 2019 EtherTrust</p>
      </div>
    );
  }
}

export default App;
