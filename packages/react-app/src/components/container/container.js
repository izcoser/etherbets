import React from "react";
import { EtherBets } from "../bets/etherbets";
import { EtherPredictions } from "../predictions/etherpredictions";
// This is a container component. 
// It is used just to minimize/maximize the EtherBets/EtherPredictions.

export class EtherContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          app: 'lottery',
        }
    }

    render(){
        const provider = this.props.provider;
        const games = this.props.games;
        const predictions = this.props.predictions;
        return(
        <>
            <div className="navBar">
                <a href="#/lottery" onClick={() => this.setState({app: 'lottery'})}>Lottery</a>
                <a href="#/pricebets" onClick={() => this.setState({app: 'predictions'})}>Price Bets</a>
                <a href="#/faq" onClick={() => this.setState({app: 'faq'})}>FAQ</a>
            </div>
            <div className="innerApp">
                <EtherBets provider={provider} games={games} minimized={this.state.app !== 'lottery'}>
                </EtherBets>
            </div>

            <div className="innerApp">
                <EtherPredictions provider={provider} predictions={predictions} minimized={this.state.app !== 'predictions'}>
                </EtherPredictions>
            </div>
            {this.state.app !== 'faq' ? (<></>) : 
                <div className="faq">
                    This website allows users to play with lotteries and crypto price bets using smart contracts.
                    You can play in a lottery and create your own in the styles of Mega Millions and Powerball.
                    Randomness is obtained from ChainLINK's VRF. The prize pool comes from entry fees.
                    The cryto price bets allow you to create and bet on prices, such as "Will Ethereum be over $10,000 by
                    November 1st?". The price is gathered from ChainLINK's price feeds and the prize is split among winners.
                </div>
            }            
        </>

        )
    }
}
