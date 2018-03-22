import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Stage, Layer, Image } from "react-konva";
import ReactModal from 'react-modal';


export default function game_init(root, channel) {
  ReactDOM.render(<TurboGame channel = {channel} />, root);
}

var count = 0;
class TurboGame extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.id = 0;
    this.count = 0;
    this.state = {
      playerInfo:{},
      winner: 0,
      obstaclePosition:[],
      playerCount: 0,
      finishPosition: [],
      obstacleimage:new window.Image(),
      image:new window.Image(),
      finishimage:new window.Image(),
      wait: 1,
      crashed : [],
      crashimg : new window.Image(),
      empty : new window.Image(),
      showModal: false
    };
    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }


  handleCloseModal () {
    this.setState({ showModal: false });
  }


  gotView(view) {
    this.setState(view.game);
    if(this.count==0){
      this.id = this.state.playerCount+1;
      this.channel.push("playerCount", {playerCount : this.state.playerCount+1, id: this.id})
      .receive("ok", this.gotView.bind(this));
      this.count = this.count+1;
    }
    this.channel.on("playerActionsCompleted", msg => {
      this.setState({playerInfo: msg.playerInfo})
      this.setState({winner: msg.winner})
      this.setState({wait: msg.wait})
      this.setState({crashed: msg.crashed})

    });
    console.log(this.state.winner);
    if(this.state.winner > 0 && this.state.crashed.length==0){
       this.alertWinner()
    }
    if(this.state.crashed.length > 0 )
      this.alertCrashed()


  }

  sendInfo(keyCode,id) {
    this.channel.push("playerActions", { keyCode : keyCode, id: id})
      .receive("ok", this.gotView.bind(this));
    }

  componentDidMount() {
    this.state.image.src = "/images/car.png";
    this.state.obstacleimage.src = "/images/road-blocker.png";
    this.state.finishimage.src = "/images/finishline.png";
    this.state.crashimg.src = "/images/boom.png";
    this.state.empty.src = "/images/empty.png";
    document.addEventListener("keydown", this._handleKeyDown.bind(this));
  }

  _handleKeyDown (event){
      event.preventDefault();
      this.sendInfo(event.keyCode,this.id);
    }

  alertwaiting(){
    alert("waiting for player 2");
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  alertCrashed() {
    setTimeout(this.handleOpenModal,1500);

  }

  alertWinner() {
      this.handleOpenModal();
  }



  render() {
    let playerInfoAll = Object.values(this.state.playerInfo);
    let carlist = playerInfoAll.map((car,i)=>
        <Image
        key={i}
        image={this.state.image}
        width={80}
        height={40}
        x={car[0]}
        y={car[1]}
        ref={i}
      />
  );

  let obstaclelist = this.state.obstaclePosition.map((obstacle,i)=>
      <Image
      key={i}
      image={this.state.obstacleimage}
      width={40}
      height={90}
      x={obstacle[0]}
      y={obstacle[1]}
      ref={i}
    />
);
let finishline = this.state.finishPosition.map((finish,i)=>
    <Image
    key={i}
    image={this.state.finishimage}
    width={80}
    height={170}
    x={finish[0]}
    y={finish[1]}
    ref={i}
  />
);

let crash =
    <Image
    image={this.state.crashimg}
    width={80}
    height={80}
    x={this.state.crashed[0]}
    y={this.state.crashed[1]}
  />

  let empty =
      <Image
      image={this.state.empty}
      width={0}
      height={0}
      x={0}
      y={0}
    />

// console.log("crashed",this.state.crashed[0]);
// console.log("winner",this.state.winner);
    return (
      <div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <BgImage  />
          {finishline}
          {obstaclelist}
          {carlist}
          {this.state.crashed.length > 0 ? crash : empty}
        </Layer>
      </Stage>
      <ReactModal
                 isOpen={this.state.showModal}
                 contentLabel="Minimal Modal Example"
              >
              <h1>{ "The Winner is Player    " + this.state.winner}</h1>
              <a href=".." className="button">Play a New Game</a>
              </ReactModal>
      <p className="waiting-msg"> {this.state.wait? "Waiting for player 2" : " "} </p>
      </div>
    );
  }
}


  class BgImage extends React.Component {
    constructor(props) {
      super(props);
      this.channel = props.channel;
      this.state = {
      image: null
    };
  }

  componentDidMount() {
    const image = new window.Image();
    image.src = "/images/background.jpeg";
    image.onload = () => {
      this.setState({
        image: image
      });
    };
  }

  render() {
    return <Image image={this.state.image} width={window.innerWidth}
        height={800} />;
  }
}
