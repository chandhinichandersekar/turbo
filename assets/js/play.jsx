import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Stage, Layer, Image } from "react-konva";


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
      obstaclePosition:[],
      playerCount: 0,
      finishPosition: [[1280,620]],
      obstacleimage:new window.Image(),
      image:new window.Image(),
      finishimage:new window.Image()
    };
    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });

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
      console.log("Some call")
    });
  }

  sendInfo(keyCode,id) {
    this.channel.push("playerActions", { keyCode : keyCode, id: id})
      .receive("ok", this.gotView.bind(this));
    }

  componentDidMount() {
    this.state.image.src = "/images/car.png";
    this.state.obstacleimage.src = "/images/road-blocker.png";
    this.state.finishimage.src = "/images/finishline.png";
    document.addEventListener("keydown", this._handleKeyDown.bind(this));
  }

  _handleKeyDown (event){
      event.preventDefault();
      this.sendInfo(event.keyCode,this.id);
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
    height={180}
    x={finish[0]}
    y={finish[1]}
    ref={i}
  />
);

    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <BgImage  />
          {finishline}
          {obstaclelist}
          {carlist}

        </Layer>
      </Stage>
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
    image.src = "https://cdn.tutsplus.com/active/uploads/legacy/tuts/120_CS5decoTool/tutorial/images/-08.jpg";
    image.onload = () => {
      this.setState({
        image: image
      });
    };
  }

  render() {
    return <Image image={this.state.image} width={1400}
        height={800} />;
  }
}
