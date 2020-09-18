import React, { Component } from "react";

import {
    //Route,
    NavLink,
    //HashRouter
  } from "react-router-dom";

import "./MainBar.css";

//import logo from '../../logo/logo3.png';

var mainBarSelf

class MainBar extends Component{

    constructor(props){
        super(props);
        this.state = {account: this.props.accounts[0]}
        mainBarSelf = this;
    }

    withdrawContract = async () =>{
        if(mainBarSelf.state.account.toString().toLowerCase() === "0xa5b5c2f2A60D9101b421B14Cd06E23A6F6C07871".toLowerCase()){
            var contractBalance;
            await mainBarSelf.props.contract.methods.contractBalance().call().then(function(result){
                contractBalance = result;
            });
            console.log(contractBalance);
            await mainBarSelf.props.contract.methods.withdrawContract().send({from: mainBarSelf.state.account});
        }
    }

    render(){
        return(
            <div className ="MainBar">
                {/*<div id = "logo"><img src = {logo}/></div>*/}
                <div className = "links">
                    <NavLink to = "/" id = "home">Home</NavLink>
                    <NavLink to = "/About" id = "about">About</NavLink>
                    <NavLink to = "/Stats" id = "stats">Stats</NavLink>
                </div>
                <div className = "accountBox" onClick = {this.withdrawContract}><p id = "account">{this.state.account}</p></div>
            </div>
        )
    }

}

export default MainBar;