import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Stage, Layer, Image } from "react-konva";


export default function game_init(root, channel) {
  ReactDOM.render(<TurboGame channel = {channel} />, root);
}

class TurboGame extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;

    //this.state = { skel: [] , count: 0 };
    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });

  }



  gotView(view) {
    console.log("New view", view);
    this.setState(view.game);
    // console.log("new game", view.game);
  }


  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <BgImage  />
          <CarImage />
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
      // setState will redraw layer
      // because "image" property is changed
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


class CarImage extends React.Component {

  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
    image: new window.Image(),
    x: 0,
    y: 700

  };
}


  _handleKeyDown (event){
    event.preventDefault();
    console.log(this.refs.car);
    const car = this.refs.car;
    console.log(car);
    console.log(car.attrs.y);
    console.log(car.attrs.x);


    var ctx = this.refs.car.getContext('2d');

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
  }


  componentDidMount() {
    this.state.image.src = "https://cdn-images.speedvegas.com/images/exotic-cars/lamborghini-aventador.png";
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
        width={100}
        height={50}
        y={this.state.y}
        x={this.state.x}
        draggable="true"
        ref="car"

      />
    );
  }
}

//
//   render() {
//     var stage = new Konva.Stage({
//       container: "root",
//       width: 1400,
//       height: 600
//
//     });
//
//     var layerBg = new Konva.Layer({
//
//     });
//
//     var layer = new Konva.Layer({
//
//     });
//
//     var imageObj = new Image();
//
//     imageObj.onload = function () {
//
//       var car = new Konva.Image({
//         x: 100,
//         y:100,
//         image: imageObj,
//         width: 100,
//         height: 50
//       });
//       layer.add(car);
//       layerBg.add(layer);
//     };
//
//     imageObj.src = "https://cdn-images.speedvegas.com/images/exotic-cars/lamborghini-aventador.png"
//     // var circle = new Konva.Circle({
//     //   radius: 40,
//     //   fill: 'blue',
//     //   x: 100,
//     //   y: 100
//     // });
//
//     var backgroundObj = new Image();
//
//     backgroundObj.onload = function () {
//
//       var background = new Konva.Image({
//         image: backgroundObj,
//         width: 1400,
//         height: 600
//       });
//       layerBg.add(background);
//       stage.add(layerBg);
//     };
//       backgroundObj.src = "https://cdn.tutsplus.com/active/uploads/legacy/tuts/120_CS5decoTool/tutorial/images/-08.jpg"
//
//     return(<div id="bucket"> <p> hello </p> </div>);
//   }
//}
