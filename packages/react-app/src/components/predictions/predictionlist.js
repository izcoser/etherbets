import React from "react";
import { Prediction } from "./prediction";

export class PredictionList extends React.Component{
    render(){
      const predictions = this.props.predictions || [];
      
      return (
        <div>
          {predictions.map((prediction, i) => <Prediction value={prediction} provider={this.props.provider} key={prediction.targetPrice + i}/>)}
        </div>
      );
    }  
}