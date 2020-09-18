import React, { Component } from "react";

import "./Stats.css";

import ethereumLogo from '../../imgs/EthereumLogo1.png';

import participantLogo from '../../imgs/ParticipantLogo1.png';

import whaleLogo from '../../imgs/WhaleLogo.png';

import creditsLogo from '../../imgs/creditsLogo.png';


class Stats extends Component{
    constructor(props){
        super(props);
        this.state = {contractBalance: 0, participants: 0, whaleStatus: 0, whalePull: 0, totalCredits: 0}
        setInterval(this.updateState, 2000);
    }

    updateState = async () =>{

        var balance;
        await this.props.contract.methods.viewContractBalance().call().then(function(result){
            balance = result/1000000000000000000;
        });

        var parts;
        await this.props.contract.methods.viewParticipants().call().then(function(result){
            parts = result;
        });
        
        var whaleCredits;
        await this.props.contract.methods.viewWhaleStatus().call().then(function(result){
            whaleCredits = result;
        });

        var pull;
        await this.props.contract.methods.viewWhalePull().call().then(function(result){
            pull = (result/1000000000000000000).toFixed(7).replace(/\.?0+$/,"");;
        });

        var credits;
        await this.props.contract.methods.viewTotalCredits().call().then(function(result){
            credits = result;
        });

        this.setState({contractBalance: balance, participants: parts, whaleStatus: whaleCredits, whalePull: pull, totalCredits: credits});
    }

    render() {
        return(
            <div className="Stats">
                <div className="statContractInfo">
                    <div className="topInfo">
                        <div id="contractEther">
                            <img id="etherLogo" alt="" src={ethereumLogo}/>
                            <div id="contractBalance">{this.state.contractBalance}</div>
                        </div>
                        <div id="contractCredits">
                            <img id="creditsLogo" alt="" src={creditsLogo}/>
                            <div id="totalCredits">{this.state.totalCredits}</div>
                        </div>
                    </div>
                    <div className="bottomInfo">
                        <div id="contractParticipants">
                            <img id="participantLogo" alt="" src={participantLogo}/>
                            <div id="participantsNumber">{this.state.participants}</div>
                        </div>
                        <div id="whaleStatus">
                            <img id="whaleLogo" alt="" src={whaleLogo}/>
                            <div id="whaleStats">
                                <div id="whaleAmount">{this.state.whaleStatus}</div>
                                {/*<div id="whaleAmount">{this.state.whalePull}</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Stats;