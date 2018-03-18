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
      playerOneInfo: [],
      playerTwoInfo: [],
      playerCount: 0,

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


  render() {
    console.log("in turbo render", this.state.playerOneInfo);
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <BgImage  />
          <CarOneImage playerOneInfo={this.state.playerOneInfo} />
          <CarTwoImage playerTwoInfo={this.state.playerTwoInfo} />
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


class CarOneImage extends React.Component {

  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
    image: new window.Image(),
    x: this.props.playerOneInfo[0],
    y: this.props.playerOneInfo[1]
  };


}


  _handleKeyDown (event){
    event.preventDefault();
    const car = this.refs.car;
    console.log("car",car);
  console.log("value of x inside switch",this.props.playerOneInfo[0]);
      switch( event.keyCode ) {

      // left arrow pressed
      case 37:
      car.to({
        x:car.attrs.x-50,
        y:car.attrs.y,
        duration: 0.2,
      });
        console.log("left key pressed");
        break;
        // up arrow pressed
      case 38:
      car.to({
        x:car.attrs.x,
        y:car.attrs.y-100,
        duration: 0.2,
      });
        console.log("up key pressed");
        break;
        // right arrow pressed
      case 39:
      car.to({
        x:car.attrs.x+50,
        y:car.attrs.y,
        duration: 0.2,
      });
        console.log("right key pressed");
        break;
        // down arrow pressed
      case 40:
      car.to({
        x:car.attrs.x,
        y:car.attrs.y+100,
        duration: 0.2,
      });
        console.log("down key pressed");
        break;
          default:
              break;
      }

      this.setState({
        x: car.attrs.x,
        y: car.attrs.y,
        duration: 0.2
      });
    
  }


  componentDidMount() {
    this.state.image.src = "/images/car.png";
    this.state.image.onload = () => {
      // calling set state here will do nothing
      // because properties of Konva.Image are not changed
      // so we need to update layer manually
    //  this.imageNode.getLayer().batchDraw();
    };
      document.addEventListener("keydown", this._handleKeyDown.bind(this));
  }


  render() {
    console.log("x value in render", this.state.x);
    return (
      <Image
        image={this.state.image}
        width={130}
        height={50}
        x={this.props.playerOneInfo[0]}
        y={this.props.playerOneInfo[1]}
        draggable="true"
        ref="car"

      />
    );
  }
}


class CarTwoImage extends React.Component {

  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
    image: new window.Image(),
    x: this.props.playerTwoInfo[0],
    y: this.props.playerTwoInfo[1]
  };
}


  _handleKeyDown (event){
    event.preventDefault();
    const car2 = this.refs.car2;

      switch( event.keyCode ) {
      // left arrow pressed
      case 65:
      car2.to({
        x:car2.attrs.x-50,
        y:car2.attrs.y,
        duration: 0.2,
      });
        console.log("left key pressed");
        break;
        // up arrow pressed
      case 87:
      car2.to({
        x:car2.attrs.x,
        y:car2.attrs.y-100,
        duration: 0.2,
      });
        console.log("up key pressed");
        break;
        // right arrow pressed
      case 68:
      car2.to({
        x:car2.attrs.x+50,
        y:car2.attrs.y,
        duration: 0.2,
      });
        console.log("right key pressed");
        break;
        // down arrow pressed
      case 83:
      car2.to({
        x:car2.attrs.x,
        y:car2.attrs.y+100,
        duration: 0.2,
      });
        console.log("down key pressed");
        break;
          default:
              break;
      }

      this.setState({
        x: car2.attrs.x,
        y: car2.attrs.y,
        duration: 0.2
      });

  }


  componentDidMount() {
    this.state.image.src = "/images/car2.png";
    this.state.image.onload = () => {
      // calling set state here will do nothing
      // because properties of Konva.Image are not changed
      // so we need to update layer manually
    //  this.imageNode.getLayer().batchDraw();
    };
      document.addEventListener("keydown", this._handleKeyDown.bind(this));
  }


  render() {
    return (
      <Image
        image={this.state.image}
        width={125}
        height={40}
        x={this.props.playerTwoInfo[0]}
        y={this.props.playerTwoInfo[1]}
        draggable="true"
        ref="car2"
      />
    );
  }
}
