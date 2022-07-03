import React from "react";
import { Sport } from "./sport";

export class SportList extends React.Component{
    render(){
      const sports = this.props.sports || [];
      
      return (
        <div className="gameList">
          {sports.map((sport, i) => <Sport value={sport} provider={this.props.provider} key={i}/>)}
        </div>
      );
    }  
}