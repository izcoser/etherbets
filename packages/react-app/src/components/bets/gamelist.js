import React from "react";
import { Game } from "./game";

export class GameList extends React.Component{
    render(){
      const games = this.props.games || [];
      
      return (
        <div className="gameList">
          {games.map((game) => <Game value={game} provider={this.props.provider} key={game.address.slice(0, 5)}/>)}
        </div>
      );
    }  
}