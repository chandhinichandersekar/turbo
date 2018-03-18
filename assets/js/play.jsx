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
    this.state = {
      playerInfo:[[],[]],
      obstaclePosition:[],
      playerOneInfo: [],
      playerTwoInfo: [],
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
    console.log("New view", view);
    this.setState(view.game);
    if(count==0){
      this.channel.push("playerCount", {playerCount : this.state.playerCount+1})
      .receive("ok", this.gotView.bind(this));
      count = count+1;
    }
    console.log(this.state);
  }

  sendo(playerInfo) {
    this.channel.push("playerInfo", {playerInfo : playerInfo})
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
      const car0 = this.refs.car0;
      console.log("car0",car0);
      const car1 = this.refs.car1;
      console.log("car1",car1);
      // console.log("value of x inside switch",this.state.playerInfo[0]);
      switch( event.keyCode ) {
        case 65:
        car0.to({
          x:car0.attrs.x-50,
          y:car0.attrs.y,
          duration: 0.2,
        });
          break;
        case 87:
        car0.to({
          x:car0.attrs.x,
          y:car0.attrs.y-100,
          duration: 0.2,
        });
          console.log("up key pressed");
          break;
          // right arrow pressed
        case 68:
        car0.to({
          x:car0.attrs.x+50,
          y:car0.attrs.y,
          duration: 0.2,
        });
          console.log("right key pressed");
          break;
          // down arrow pressed
        case 83:
        car0.to({
          x:car0.attrs.x,
          y:car0.attrs.y+100,
          duration: 0.2,
        });
        break;
        case 37:
          car1.to({
            x:car1.attrs.x-50,
            y:car1.attrs.y,
            duration: 0.2,
          });
            console.log("left key pressed");
            break;
          case 38:
          car1.to({
            x:car1.attrs.x,
            y:car1.attrs.y-100,
            duration: 0.2,
          });
            console.log("up key pressed");
            break;
            // right arrow pressed
          case 39:
          car1.to({
            x:car1.attrs.x+50,
            y:car1.attrs.y,
            duration: 0.2,
          });
            console.log("right key pressed");
            break;
            // down arrow pressed
          case 40:
          car1.to({
            x:car1.attrs.x,
            y:car1.attrs.y+100,
            duration: 0.2,
          });
            console.log("down key pressed");
            break;
              default:
                  break;
          }
        this.setState({playerInfo:[[car0.attrs.x,car0.attrs.y],[car1.attrs.x,car1.attrs.y]]});
        console.log("state", this.state.playerInfo);
        this.sendo(this.state.playerInfo);
    }

  render() {

    let carlist = this.state.playerInfo.map((car,i)=>
        <Image
        key={i}
        image={this.state.image}
        width={130}
        height={50}
        x={car[0]}
        y={car[1]}
        ref={"car"+i}
      />
  );
  let obstaclelist = this.state.obstaclePosition.map((obstacle,i)=>
      <Image
      key={i}
      image={this.state.obstacleimage}
      width={80}
      height={100}
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

    console.log("in turbo render", this.state.playerInfo);


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
