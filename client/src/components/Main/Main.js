import React, { Component } from "react";

import "./Main.css";

import ethereumLogo from '../../imgs/EthereumLogo1.png';

import participantLogo from '../../imgs/ParticipantLogo1.png';

import creditsLogo from '../../imgs/creditsLogo.png';

class WithdrawBox extends Component{
    constructor(props){
        super(props);
    }

    withdraw = async() =>{
        await this.props.contract.methods.withdraw().send({from: this.props.accounts[0]});
    }

    render(){
        if(this.props.credits > 0){
            return(
                <div id="withdrawBox">
                    <div id="withdrawAmount">{this.props.withdrawMsg} {this.props.block}</div>
                     <input id="withdraw" type="submit" value="Withdraw" onClick={this.withdraw}/>
                </div>
            );
        }
        return null;
    }
}


class Main extends Component{

    constructor(props){
        super(props);
        this.state = {account: this.props.accounts[0], 
                      greeting: "You have not yet deposited to Ether Trust.",
                      newGreet: "",
                      withdrawMsg: "",
                      contractBalance: 0,
                      participants: 0,
                      credits: 0,
                      contract: this.props.contract,
                      accounts: this.props.accounts
                    }
        this.addEventListener(this);
        setInterval(this.updateState, 5000);
    }
    
    updateState = async() => {
        var amount; 
        await this.props.contract.methods.getCredits(this.props.accounts[0]).call().then(function(result){
            amount = result;
        });

        if(amount > 0){
            var claimAmt;
            await this.props.contract.methods.viewWithdraw(this.state.account).call().then(function(result){
                claimAmt = Number(result / 1000000000000000000).toFixed(10).replace(/\.?0+$/,"");
            });
            this.setState({greeting: "You currently have " + amount + " credits.", withdrawMsg: "You can claim " + claimAmt + " Ether!", newGreet: ""});
        }
        else{
            this.setState({newGreet: "Deposit in increments of .001 ether to recieve daily dividends!"});
        }
        var contractBal;
        await this.props.contract.methods.viewContractBalance().call().then(function(result){
            contractBal = result / 1000000000000000000;
        });

        var parts;
        await this.props.contract.methods.viewParticipants().call().then(function(result){
            parts = result;
        });

        this.setState({credits: amount, contractBalance: contractBal, participants: parts});

    }

    addEventListener(){
        this.props.contract.events.logCredits({fromBlock: 0, toBlock: 'latest'})
        .on('data', function(event){
            console.log(event.returnValues.credits); // same results as the optional callback above
        })
        .on('error', console.error);
    }

    deposit = async () => {
        var depositValue = document.getElementById("depositInput").value * 1000000000000000000;
        await this.props.contract.methods.deposit().send({from: this.props.accounts[0], value: depositValue});
    }



    render(){
        return(
            <div className="Main">
                <div className="ParticipantInfo">
                    <div id="mainGreeting">{this.state.greeting}</div>
                    <div id="newGreeting">{this.state.newGreet}</div>
                    <div id="depositBox">
                        <p> Deposit Amount:</p> &nbsp;
                        <input id="depositInput" type="number" step="0.001"/>&nbsp;
                        <input id="sendDeposit" type="submit" value="Deposit" onClick = {() => this.deposit()}/>
                    </div>
                    <WithdrawBox {...this.state}/>
                </div>
                <div className="ContractInfo">
                    <div id="contractEther">
                        <img id="etherLogo" alt="" src={ethereumLogo}/>
                        <div id="contractBalance">{this.state.contractBalance}</div>
                    </div>
                    <div id="contractParticipants">
                        <img id="participantLogo" alt="" src={participantLogo}/>
                        <div id="participantsNumber">{this.state.participants}</div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Main;
