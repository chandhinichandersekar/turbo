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
    // console.log("player name :" , this.);
  }

  gotView(view) {
    console.log("New view", view);
    this.setState(view.game);

    if(count==0){
      this.id = this.state.playerCount+1;
      this.channel.push("playerCount", {playerCount : this.state.playerCount+1, id: this.id})
      .receive("ok", this.gotView.bind(this));
      count = count+1;
    }

  }

  sendInfo(playerInfo) {
    this.channel.push("playerInfo", {playerInfo : playerInfo})
      .receive("ok", this.gotView.bind(this));
    }

  componentDidMount() {
    console.log("component mounted back",this.state.playerInfo);
    this.state.image.src = "/images/car.png";
    this.state.obstacleimage.src = "/images/road-blocker.png";
    this.state.finishimage.src = "/images/finishline.png";
    document.addEventListener("keydown", this._handleKeyDown.bind(this));
  }
    _handleKeyDown (event){
      event.preventDefault();
      const car = this.refs.car;
      console.log(this.id);
      switch( event.keyCode ) {
        case 37:
          car.to({
            x:car.attrs.x-50,
            y:car.attrs.y,
            duration: 0.2,
          });
            console.log("left key pressed");
            break;
          case 38:
          car.to({
            x:car.attrs.x,
            y:car.attrs.y-50,
            duration: 0.2,
          });
            console.log("up key pressed");
            break;
          case 39:
          car.to({
            x:car.attrs.x+50,
            y:car.attrs.y,
            duration: 0.2,
          });
            console.log("right key pressed");
            break;
          case 40:
          car.to({
            x:car.attrs.x,
            y:car.attrs.y+50,
            duration: 0.2,
          });
            console.log("down key pressed");
            break;
          default:
              break;
          }
        this.setState({playerInfo:[[car.attrs.x,car.attrs.y]]});
        console.log("state", this.state.playerInfo);
        this.sendInfo(this.state.playerInfo);
    }

  render() {
    console.log(Object.values(this.state.playerInfo));
    let playerInfoAll = Object.values(this.state.playerInfo);
    console.log(playerInfoAll[0]);
    let carlist = playerInfoAll.map((car,i)=>
        <Image
        key={i}
        image={this.state.image}
        width={130}
        height={50}
        x={car[0]}
        y={car[1]}
        ref={"car"}
      />
  );
//   let carlist2 = this.state.playerTwoInfo.map((car,i)=>
//       <Image
//       key={i}
//       image={this.state.image}
//       width={130}
//       height={50}
//       x={car[0]}
//       y={car[1]}
//       ref={"car"+i}
//     />
// );
//   let obstaclelist = this.state.obstaclePosition.map((obstacle,i)=>
//       <Image
//       key={i}
//       image={this.state.obstacleimage}
//       width={80}
//       height={100}
//       x={obstacle[0]}
//       y={obstacle[1]}
//       ref={i}
//     />
// );
// let finishline = this.state.finishPosition.map((finish,i)=>
//     <Image
//     key={i}
//     image={this.state.finishimage}
//     width={80}
//     height={180}
//     x={finish[0]}
//     y={finish[1]}
//     ref={i}
//   />
// );

    console.log("in turbo render", this.state.playerInfo);


    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <BgImage  />
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
