import React from "react";
import { abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

export class BetInput extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        inputValue: '',
        validInput: false,
      };
    }
  
    updateInputValue(evt){
      const val = evt.target.value;
      const maxNumber = this.props.game.maxNumber;
      const picks = this.props.game.picks;
      const numbers = val.split(',').map(Number);
      this.setState({
        inputValue: val,
        validInput: (numbers.length === picks) && (numbers.filter((n) => n > maxNumber || n < 1).length === 0) && ((new Set(numbers)).size === numbers.length),
      });
    }
  
    render(){
      const bet = {
        validInput: this.state.validInput,
        numbers: this.state.inputValue.split(',').map(Number),
        address: this.props.game.address,
        betCost: this.props.game.betCost,
      }
  
      return(
        <>
        <input className="input-40" type="text" onChange={evt => this.updateInputValue(evt)} value={this.state.inputValue} placeholder="1, 2, 3, ..., n"/>
        <input type="button" className="button-40" onClick={() => placeBet(this.props.provider, bet)} value="Bet" />
        </>
      );
    }
}

export async function placeBet(provider, bet){
    if(bet.validInput){
      console.log('Trying to place a bet at contract' + bet.address);
      console.log('With numbers: ' + bet.numbers);
      console.log('And betCost: ' + bet.betCost);
      const contract = new Contract(bet.address, abis.etherBets, provider.getSigner());
      await contract.placeBet(bet.numbers, { value: bet.betCost }).catch((err) => { console.log(err)})
    }
    else{
      console.log('Bet input is invalid.');   
    } 
  }