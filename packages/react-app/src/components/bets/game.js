import React from "react";
import { ethers } from "ethers";
import { BetInput } from "./betinput";
import { abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

export class Game extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        minimized: true,
      }
    }
  
    render(){
      const game = this.props.value;
      const minimized = this.state.minimized;
      const unixTime = Math.round(+new Date() / 1000);
      const gameBegin = (unixTime - game.lastDrawTime > game.timeBetweenDraws) && game.paused === false;
      const gameDraw = game.paused && game.randomNumberFetched;
      const nextDrawTime = (game.lastDrawTime + game.timeBetweenDraws) * 1000; // to millis
      const nextDraw = new Date(nextDrawTime).toLocaleDateString("en-US") + ' ' + new Date(nextDrawTime).toLocaleTimeString("en-US");
      const winningNumbers = (game.winningNumbers.map((n) => (<div className="winningNumber">{n}</div>)) || "No draws");
      const paused = game.paused;

      const innerMinimized = (<div className="gameInner">
            <div className="gamePrize">Prize: {ethers.utils.formatEther(game.prize.toString()) + " ETH"}</div>
      </div>)
  
      const innerMaximized = (<div className="gameInner">
            <div className="gameInfo">
              <div className="gameInstruction">Choose <div className="gamePicks">{game.picks}</div> numbers from 1 to <div className="gameMax">{game.maxNumber}</div></div>
              <div className="gamePrize">Prize: {ethers.utils.formatEther(game.prize.toString()) + " ETH"}</div>
              <div className="gameCost">Bet Cost: {ethers.utils.formatEther(game.betCost.toString()) + " ETH"}</div>
              <div className="nextDraw">Next Draw: {nextDraw}</div>
              <div className="lastNumbers">Last Winning Numbers: {winningNumbers}</div>
              <div className="gameOdds">Odds: 1 in {game.odds.toLocaleString()}</div>
              <div className="gameContract"><a className="contractLink" href={"https://rinkeby.etherscan.io/address/" + game.address} target="_blank" rel="noreferrer">Contract Address</a></div>
            </div>
            <div className="gameInputs">
              {paused ? (<input disabled className="button-40" type="button" value="Bets are paused"></input>) : (<BetInput game={game} provider={this.props.provider}></BetInput>)}
              {gameBegin ? (<input className="gameBegin button-40" type="button" value="Begin Lottery" onClick={() => beginGame(this.props.provider, game)}></input>) : <></>}
              {gameDraw ? (<input className="gameDraw button-40" type="button" value="Draw Numbers" onClick={() => drawNumbers(this.props.provider, game)}></input>) : <></>}
            </div>
            </div>)
  
        return (
          <div
            className={minimized ? "game minimized" : "game maximized"}>
            <div className="gameName" onClick={() => this.setState({minimized: !this.state.minimized})}>{game.name}</div>
            {minimized ? innerMinimized : innerMaximized}
          </div>
        );
    }
  }

async function beginGame(provider, bet){
  console.log('Trying to begin game at contract' + bet.address);
  const contract = new Contract(bet.address, abis.etherBets, provider.getSigner());
  await contract.beginDraw().catch((err) => { console.log(err)})
}

async function drawNumbers(provider, bet){
  console.log('Trying to draw numbers at contract' + bet.address);
  const contract = new Contract(bet.address, abis.etherBets, provider.getSigner());
  await contract.drawNumbers().catch((err) => { console.log(err)})
}