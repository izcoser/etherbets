import React from "react";
import rinkebyPricePairs from "./rinkebyPriceProxies.js";
//import { boolToClass } from "./utils"

export class PredictionCreator extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        aggregator: '',
        targetPrice: '',
        targetTime: '',
        deadline: '',
        minimized: true,
      };
    }

    render(){
      const prediction = {
        aggregator: this.state.aggregator,
        targetPrice: this.state.targetPrice,
        targetTime: this.state.targetTime,
        deadline: this.state.deadline,
      };
      const minimized = this.state.minimized;
      const pricePairs = Object.fromEntries(Object.entries(rinkebyPricePairs).filter(([k, v]) => !k.startsWith('0x')));
      const tickers = Object.keys(pricePairs);

      const innerMaximized = (<>
        <select id="pricePairs" onChange={(evt) => this.setState({aggregator: evt.target.value})}>
            {tickers.map((ticker, i) => <option value={pricePairs[ticker][1]} key={i}>            
                {ticker}
            </option>)}
        </select>
        <input type="text" onChange={evt => this.setState({targetPrice: evt.target.value})} placeholder="Target Price"/>
        <input type="text" onChange={evt => this.setState({targetTime: evt.target.value})} placeholder="Target Time"/>
        <input type="text" onChange={evt => this.setState({deadline: evt.target.value})} placeholder="Deadline"/>
        <input type="button" value="Create" onClick={() => this.props.creator(prediction)}/>
          </>);
      return(
        <>
        <div className="createGameWrapper">
          <div className="createGame" onClick={() => this.setState({minimized: !this.state.minimized})}>Create a New Price Bet</div>
          {minimized ? (<></>) : (innerMaximized)}
        </div>
        </>
      );
    }
  }