import React from "react";

export class GameCreator extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        inputName: '',
        validName: false,
        inputPicks: '',
        inputMaxNumber: '',
        inputBetCost: '',
        inputTimeBetweenDraws: '',
        minimized: true,
      };
    }
  
    updateNameValue(evt){
      this.setState({
        inputName: evt.target.value.substring(0, 128),
        validName: evt.target.value.length > 0,
      });
    }
  
    updatePicksValue(evt){
      const re = /^[0-9\b]*$/;
      const val = evt.target.value;

      if(re.test(val) && Number(val) <= 255){
        this.setState({
          inputPicks: val,
        });
      }
    }
  
    updateMaxNumberValue(evt){
      const re = /^[0-9\b]*$/;
      const val = evt.target.value;
      
      if(re.test(val) && Number(val) <= 255){
        this.setState({
          inputMaxNumber: val,
        });
      }
    }
  
    updateBetCost(evt){
      const re = /^[0-9\b]*[.]?[0-9\b]*$/;
      const val = evt.target.value.replace(',', '.');
      if(re.test(val)){
        this.setState({
          inputBetCost: val,
        });
      }
    }
  
    updateTimeBetweenDraws(evt){
      const re = /^[0-9\b]*$/;
      const val = evt.target.value;
      if(re.test(val)){
        this.setState({
          inputTimeBetweenDraws: val,
        });
      }
    }
  
    render(){
      const game = {
        validInput: this.state.validName && Number(this.state.inputPicks) > 3
        && Number(this.state.inputMaxNumber) > 4 && this.state.inputBetCost.length > 0
        && this.state.inputTimeBetweenDraws.length > 0,
        name: this.state.inputName,
        picks: Number(this.state.inputPicks),
        maxNumber: Number(this.state.inputMaxNumber),
        betCost: this.state.inputBetCost,
        timeBetweenDraws: this.state.inputTimeBetweenDraws,
        minimized: this.state.minimized,
      }

      const innerMaximized = (<>
          <input className="input-40" type="text" autoComplete="off" autoCorrect="off" onChange={evt => this.updateNameValue(evt)} value={this.state.inputName} placeholder="Game name"/>
          <input className="input-40" type="text" inputMode="numeric" autoComplete="off" autoCorrect="off" pattern="^[0-9]*" onChange={evt => this.updatePicksValue(evt)} value={this.state.inputPicks} placeholder="Picks"/>
          <input className="input-40" type="text" inputMode="numeric" autoComplete="off" autoCorrect="off" pattern="^[0-9]*" onChange={evt => this.updateMaxNumberValue(evt)} value={this.state.inputMaxNumber} placeholder="Max Number"/>
          <input className="input-40" type="text" inputMode="decimal" autoComplete="off" autoCorrect="off" pattern="^[0-9]*[.,]?[0-9]*$" onChange={evt => this.updateBetCost(evt)} value={this.state.inputBetCost} placeholder="Bet Cost in ETH"/>
          <input className="input-40" type="text" autoComplete="off" autoCorrect="off" onChange={evt => this.updateTimeBetweenDraws(evt)} value={this.state.inputTimeBetweenDraws} placeholder="Time Between Draws (sec)"/>
  
          <input type="button" className="button-40" value="Create" onClick={() => this.props.creator(game)}/>
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