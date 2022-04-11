import React from "react";
import { ethers } from "ethers";
import { abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

export class Prediction extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        minimized: true,
        betAmount: '',
        validBetAmount: false,
      }
    }

    updateBetAmount = (evt) => {
      const val = evt.target.value
      this.setState({
        betAmount: val,
        validBetAmount: !isNaN(val) && Number(val) > 0
      });
    }
  
    render(){
      const prediction = this.props.value;
      const minimized = this.state.minimized;
      const unixTime = Math.round(+new Date() / 1000);
      const obtainPrice = (unixTime > prediction.targetTime) && prediction.obtainedPrice === false;
      const claimPrize = ethers.utils.formatEther(prediction.claimablePrize.toString());
      const targetDate = new Date(prediction.targetTime * 1000).toLocaleDateString("en-US") + ' ' + new Date(prediction.targetTime * 1000).toLocaleTimeString("en-US");
      const deadlineDate = new Date(prediction.deadline * 1000).toLocaleDateString("en-US") + ' ' + new Date(prediction.deadline * 1000).toLocaleTimeString("en-US");
      const betsOpen = unixTime < prediction.deadline;
      const total = Number(prediction.total[0]) + Number(prediction.total[1]);
      const predictionClosingString = prediction.obtainedPrice ? "The price was $" + prediction.fetchedPrice  / 100000000.0 : "Bets close at " + deadlineDate;
      const validBetAmount = this.state.validBetAmount;
      const betAmountETH = validBetAmount ? ethers.utils.parseEther(this.state.betAmount) : 0;

      const innerMinimized = (<div className="predictionInner">
            <div className="predictionTotal">Total Bet: {ethers.utils.formatEther(total.toString()) + " ETH"}</div>
      </div>)
  
      const innerMaximized = (<div className="gameInner">
            <div className="predictionInfo">
              <div className="predictionInstruction">Predict the price of {prediction.ticker} and win!</div>
              <div className="predictionPrize">Prize: {ethers.utils.formatEther(total.toString()) + " ETH"}</div>
              <div className="predictionDeadline">{predictionClosingString}</div>
              <div className="predictionContract"><a className="contractLink" href={"https://rinkeby.etherscan.io/address/" + prediction.address} target="_blank" rel="noreferrer">Contract Address</a></div>
            </div>
            <div className="predictionInputs">
                {betsOpen ? (<>
                    <input type="text" value={this.state.betAmount}
                      onChange={(evt) => this.updateBetAmount(evt)}
                      placeholder="Bet amount in ETH">
                    </input>
                    <input type="button" value="YES"
                      disabled={!validBetAmount}
                      onClick={() => placeBet(this.props.provider, prediction, true, betAmountETH)}>
                    </input>
                    <input type="button" value="NO"
                      disabled={!validBetAmount}
                      onClick={() => placeBet(this.props.provider, prediction, false, betAmountETH)}>
                    </input>
                </>)
                        : <></>
                }
                
                {claimPrize > 0 ? (<input type="button" value={"Claim Prize: " + claimPrize + " ETH"} onClick={() => claimPrizeFunc(this.props.provider, prediction)}></input>) : (<></>)}
                {obtainPrice ? (<input type="button" value="Obtain Price" onClick={() => obtainPriceFunc(this.props.provider, prediction)}></input>) : (<></>)}
            </div>
            </div>)
  
        return (
          <div
            className={minimized ? "prediction minimized" : "prediction maximized"}>
            <div className="predictionName" onClick={() => this.setState({minimized: !this.state.minimized})}>Will {prediction.ticker} be higher than ${prediction.targetPrice / 100000000.0 } at {targetDate}?</div>
            {minimized ? innerMinimized : innerMaximized}
          </div>
        );
    }
  }

async function placeBet(provider, prediction, higher, betAmount){
  console.log('Trying to make prediction at contract' + prediction.address);
  const contract = new Contract(prediction.address, abis.prediction, provider.getSigner());
  await contract.placeBet(higher, { value: betAmount }).catch((err) => { console.log(err)})
}

async function claimPrizeFunc(provider, prediction){
    console.log('Trying to claim prize at contract' + prediction.address);
    const contract = new Contract(prediction.address, abis.prediction, provider.getSigner());
    await contract.claimPrize().catch((err) => { console.log(err)})
  }

async function obtainPriceFunc(provider, prediction){
    console.log('Trying to obtain price at contract' + prediction.address);
    const contract = new Contract(prediction.address, abis.prediction, provider.getSigner());
    await contract.obtainPrice().catch((err) => { console.log(err)})
}