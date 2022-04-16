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
        const app = this.state.app;

        return(
        <>
            <div className="navBar">
                <a href="#/lottery" className={"navLink" + (app === "lottery" ? " active" : "")} onClick={() => this.setState({app: 'lottery'})}>Lottery</a>
                <a href="#/pricebets" className={"navLink" + (app === "predictions" ? " active" : "")} onClick={() => this.setState({app: 'predictions'})}>Price Bets</a>
                <a href="#/faq" className={"navLink" + (app === "faq" ? " active" : "")} onClick={() => this.setState({app: 'faq'})}>FAQ</a>
            </div>
            <div className="innerApp">
                <EtherBets provider={provider} games={games} minimized={app !== 'lottery'}>
                </EtherBets>
            </div>

            <div className="innerApp">
                <EtherPredictions provider={provider} predictions={predictions} minimized={app !== 'predictions'}>
                </EtherPredictions>
            </div>
            {app !== 'faq' ? (<></>) : 
                <div className="faq">
                    <div className="faqQuestion">
                        What is Etherbets?
                    </div>
                    <div className="faqAnswer">
                        This is a website for bets using smart contracts, currently running on the Rinkeby test network.
                        Users can play in lotteries and bet on crypto prices, as well as create their own for others to participate.
                        Everything is secured by smart contracts in a trustless and decentralized manner. 
                    </div>
                    <div className="faqQuestion">
                        How do the lotteries work?
                    </div>
                    <div className="faqAnswer">
                        The lotteries are created by users interacting with the factory contract. The creator chooses a name,
                        how many numbers are to be picked, the maximum number, the bet cost, the interval between draws, and deploys the contract for that instance. 
                        Then, users can import that with its contract address and start placing bets.
                        Later, a transaction initiates the draw, pausing new bets and requesting randomness to a ChainLINK VRF coordinator.
                        When the randomness is fulfilled, a transaction is made to derive the winning numbers and pay the winners using the entry fees.
                        If nobody wins, the prize accumulates.
                        Finally, a new cycle begins and more bets can be placed. 
                    </div>
                    <div className="faqQuestion">
                        How do price bets work?
                    </div>
                    <div className="faqAnswer">
                        Similarly, users create their own price bets from the factory contract, choosing a pairing, a target price, a target time, and a deadline.
                        Until the deadline is reached, other users can import that and answer "YES" if they think the price will be higher or "NO" otherwise.
                        When the target time is reached, a transaction is made to fetch the price using ChainLINK's Price Feeds.
                        Lastly, winners are able to claim their prize proportionally to their bets.
                        Prize money comes from the losers.
                    </div>
                </div>
            }            
        </>

        )
    }
}
