import React from "react";
import { boolToClass } from "./utils"

export class GameCreator extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        inputName: '',
        inputPicks: '',
        inputMaxNumber: '',
        inputBetCost: '',
        inputTimeBetweenDraws: '',
        validName: false,
        validPicks: false,
        validMaxNumber: false,
        validBetCost: false,
        validTimeBetweenDraws: false,
        minimized: true,
      };
    }
  
    updateNameValue(evt){
      const val = evt.target.value;
      this.setState({
        inputName: val,
        validName: (val.length  > 0 && val.length < 128),
      });
    }
  
    updatePicksValue(evt){
      const val = evt.target.value;
      this.setState({
        inputPicks: val,
        validPicks: parseInt(val) > 3 && parseInt(val) <= 255,
      });
    }
  
    updateMaxNumberValue(evt){
      const val = evt.target.value;
      this.setState({
        inputMaxNumber: val,
        validMaxNumber: parseInt(val) > 4 && parseInt(val) <= 255,
      });
    }
  
    updateBetCost(evt){
      const val = evt.target.value;
      this.setState({
        inputBetCost: val,
        validBetCost:  !isNaN(val) && Number(val) > 0,
      });
    }
  
    updateTimeBetweenDraws(evt){
      const val = evt.target.value;
      this.setState({
        inputTimeBetweenDraws: val,
        validTimeBetweenDraws: !isNaN(val) && Number(val) > 0,
      });
    }
  
    render(){
      const game = {
        name: this.state.inputName,
        picks: Number(this.state.inputPicks),
        maxNumber: Number(this.state.inputMaxNumber),
        betCost: this.state.inputBetCost,
        timeBetweenDraws: this.state.inputTimeBetweenDraws,
        minimized: this.state.minimized,
      }

      const innerMaximized = (<>
          <input className={boolToClass(this.state.validName)} type="text" onChange={evt => this.updateNameValue(evt)} value={this.state.inputName} placeholder="Game name"/>
          <input className={boolToClass(this.state.validPicks)} type="text" onChange={evt => this.updatePicksValue(evt)} value={this.state.inputPicks} placeholder="Picks"/>
          <input className={boolToClass(this.state.validMaxNumber)} type="text" onChange={evt => this.updateMaxNumberValue(evt)} value={this.state.inputMaxNumber} placeholder="Max Number"/>
          <input className={boolToClass(this.state.validBetCost)} type="text" onChange={evt => this.updateBetCost(evt)} value={this.state.inputBetCost} placeholder="Bet Cost in ETH"/>
          <input className={boolToClass(this.state.validTimeBetweenDraws)} type="text" onChange={evt => this.updateTimeBetweenDraws(evt)} value={this.state.inputTimeBetweenDraws} placeholder="Time between draws in seconds"/>
  
          <input type="button" value="Create" onClick={() => this.props.creator(game)}/>
          </>);
      return(
        <>
        <div className="createGameWrapper">
          <div className="createGame" onClick={() => this.setState({minimized: !this.state.minimized})}>Create a New Game</div>
          {game.minimized ? (<></>) : (innerMaximized)}
        </div>
        </>
      );
    }
  }