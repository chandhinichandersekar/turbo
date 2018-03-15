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
    this.state = {
    image: null
  };

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
        height={600} />;
  }
}


class CarImage extends React.Component {

  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
    image: new window.Image()
  };
}
  componentDidMount() {
    this.state.image.src = "https://cdn-images.speedvegas.com/images/exotic-cars/lamborghini-aventador.png";
    this.state.image.onload = () => {
      // calling set state here will do nothing
      // because properties of Konva.Image are not changed
      // so we need to update layer manually
      this.imageNode.getLayer().batchDraw();
    };
  }

  render() {
    return (
      <Image
        image={this.state.image}
        width={100}
        height={50}
        y={500}
        ref={node => {
          this.imageNode = node;
        }}
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
