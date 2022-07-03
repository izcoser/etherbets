import React from "react";
import { ethers } from "ethers";
import { abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";
import { SportList } from "./sportlist";

export class Sport extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        minimized: true,
        betAmount: '',
      }
    }

    updateBetAmount = (evt) => {
      const re = /^[0-9\b]*[.]?[0-9\b]*$/;
      const val = evt.target.value.replace(',', '.');
      
      if(re.test(val)){
        this.setState({
          betAmount: val,
        });
      }
    }
  
    render(){
      const sport = this.props.value;
      const minimized = this.state.minimized;
      const unixTime = Math.round(+new Date() / 1000);
      const obtainResultSD = (unixTime > sport.gameDate + 10 * 3600) && !sport.fetchedSD;
      const obtainResultRD = (unixTime > sport.gameDate + 10 * 3600) && !sport.fetchedRD;
      const aggregate = sport.fetchedSD && sport.fetchedRD && !sport.resultAggregated;
      const claimPrize = ethers.utils.formatEther(sport.claimablePrize.toString());
      const formattedDate = new Date(sport.gameDate * 1000).toLocaleDateString("en-US") + ' ' + new Date(sport.gameDate * 1000).toLocaleTimeString("en-US");
      const betsOpen = unixTime < sport.gameDate;
      const total = Number(sport.total[0]) + Number(sport.total[1]);
      const sportClosingString = sport.resultAggregated ? "The winner was " + (sport.homeWinner ? sport.homeTeam : sport.awayTeam) + "." : "Bets close at " + formattedDate;
      const scoreString = "Score: " + sport.homeScore + " x " + sport.awayScore;
      const betAmountETH = this.state.betAmount === '' ? 0 : ethers.utils.parseEther(this.state.betAmount);

      const innerMaximized = (<div className="gameInner">
            <div className="predictionInfo">
              <div className="predictionDeadline">{sportClosingString}</div>
              {sport.resultAggregated ? (<div className="predictionDeadline">{scoreString}</div>) : <></>}
              <div className="predictionContract"><a className="contractLink" href={"https://kovan.etherscan.io/address/" + sport.address} target="_blank" rel="noreferrer">Contract Address</a></div>
            </div>
            <div className="predictionInputs">
                {betsOpen ? (<>
                    <input type="text" className="input-40"
                      inputMode="decimal" autoComplete="off" autoCorrect="off"
                      pattern="^[0-9]*[.,]?[0-9]*$" value={this.state.betAmount}
                      onChange={(evt) => this.updateBetAmount(evt)}
                      placeholder="Bet amount in ETH">
                    </input>
                    <input type="button" className="button-40" value={sport.homeTeam}
                      onClick={() => placeBet(this.props.provider, sport, true, betAmountETH)}>
                    </input>
                    <input type="button" className="button-40" value={sport.awayTeam}
                      onClick={() => placeBet(this.props.provider, sport, false, betAmountETH)}>
                    </input>
                </>)
                        : <></>
                }
                
                {claimPrize > 0 ? (<input type="button" className="button-40" value={"Claim Prize: " + claimPrize + " ETH"} onClick={() => claimPrizeFunc(this.props.provider, sport)}></input>) : (<></>)}
                {obtainResultSD ? (<input type="button" className="button-40" value="Obtain Result from Sports Data" onClick={() => obtainResultFunc(this.props.provider, sport, 0)}></input>) : (<></>)}
                {obtainResultRD ? (<input type="button" className="button-40" value="Obtain Result from TheRundown" onClick={() => obtainResultFunc(this.props.provider, sport, 1)}></input>) : (<></>)}
                {aggregate ? (<input type="button" className="button-40" value="Aggregate Results" onClick={() => aggregateResults(this.props.provider, sport)}></input>) : (<></>)}
            </div>
            </div>)
  
        return (
          <div
            className={minimized ? "prediction minimized" : "prediction maximized"}>
            <div className="predictionName" onClick={() => this.setState({minimized: !this.state.minimized})}><span className="ticker">{sport.homeTeam} vs {sport.awayTeam}</span> on {formattedDate}</div>
            <div className="predictionPrize">Prize: {ethers.utils.formatEther(total.toString()) + " ETH"}</div>
            {minimized ? <></> : innerMaximized}
          </div>
        );
    }
  }

async function placeBet(provider, sport, homeTeam, betAmount){
  console.log('Trying to make prediction at contract' + sport.address);
  const contract = new Contract(sport.address, abis.sportsBet, provider.getSigner());
  await contract.placeBet(homeTeam, { value: betAmount }).catch((err) => { console.log(err)})
}

async function claimPrizeFunc(provider, sport){
    console.log('Trying to claim prize at contract' + sport.address);
    const contract = new Contract(sport.address, abis.sportsBet, provider.getSigner());
    await contract.claimPrize().catch((err) => { console.log(err)})
  }

async function obtainResultFunc(provider, sport, oracle){
    console.log('Trying to obtain price at contract' + sport.address);
    const contract = new Contract(sport.address, abis.sportsBet, provider.getSigner());
    if(oracle === 0){
      await contract.requestResultFromSD().catch((err) => { console.log(err)})
    }
    else if(oracle === 1){
      await contract.requestResultFromRD().catch((err) => { console.log(err)})
    }
}

async function aggregateResults(provider, sport){
  console.log('Trying to aggregate results at contract' + sport.address);
  const contract = new Contract(sport.address, abis.sportsBet, provider.getSigner());
  await contract.aggregateResults().catch((err) => { console.log(err)})
}
