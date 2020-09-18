import React, { Component } from "react";

import "./About.css";

import participantLogo from '../../imgs/ParticipantLogo1.png';

import creditsLogo from '../../imgs/creditsLogo.png';

import whaleLogo from '../../imgs/WhaleLogo.png';

import ethereumLogo from '../../imgs/EthereumLogo1.png';

class About extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="AboutBox">
                <div className="aboutMain">
                    <p>Ether Trust is a social trust experiment that allows participants to earn daily dividends from the Ether Trust smart contract on the Ethereum blockchain.</p>
                    <p>Participants<img alt="" src={participantLogo} id="participantLogoA"/>of Ether Trust can earn 1.116% dividends on the credits they obtain from the smart contract every 6200 blocks.</p>
                    <div id="creditsStatement"><p>Credits <img alt="" src={creditsLogo} id="creditsLogoA"/> can be obtained by depositing .001 ether per credit to the smart contract.</p></div>
                    <p>Participants with whale status &nbsp;<img alt="" src={whaleLogo} id="whaleLogoA"/>&nbsp;will be able to withdraw at most .05% of the contract balance <img alt="" src={ethereumLogo} id="ethereumLogoA"/><br/>per 6200 blocks.</p>                
                </div>
            </div>
        );
    }
}

export default About;