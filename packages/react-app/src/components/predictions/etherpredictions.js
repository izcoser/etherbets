import React from "react";
import { PredictionList } from "./predictionlist";

export class EtherPredictions extends React.Component{
    render(){
      const minimized = this.props.minimized;
      const predictions = this.props.predictions;
      return(
        <div>
          {minimized ? (<></>) :
          (<>
            <PredictionList predictions={predictions} provider={this.props.provider}></PredictionList>
          </>)
          }
        </div>
      );
    }
}
