import React from "react";

export class ContractImporter extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        contract: "",
        minimized: true,
      };
    }

    render(){
      const minimized = this.state.minimized;
      const setContracts = this.props.setContracts;
      const dataAddresses = this.props.data.map(d => d.address);
      const title = this.props.title;

      const innerMaximized = (<>
        <input type="text" className="input-40" onChange={evt => this.setState({contract: evt.target.value})} placeholder="Contract Address"/>
        <input type="button" className="button-40" value="Import" onClick={() => setContracts(dataAddresses.concat(this.state.contract))}/>
          </>);
      return(
        <>
        <div className="createGameWrapper">
          <div className="createGame" onClick={() => this.setState({minimized: !this.state.minimized})}>{title}</div>
          {minimized ? (<></>) : (innerMaximized)}
        </div>
        </>
      );
    }
  }