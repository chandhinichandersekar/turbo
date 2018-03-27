import React from "react";
import ReactDOM from "react-dom";
import { Button } from "reactstrap";
import { Stage, Layer, Image } from "react-konva";
import ReactModal from "react-modal";

export default function game_init(root, channel) {
  ReactDOM.render(<TurboGame channel={channel} />, root);
}

var count = 0;
class TurboGame extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.id = 0;
    this.count = 0;
    this.state = {
      playerInfo: {},
      winner: 0,
      obstaclePosition: [],
      playerCount: 0,
      finishPosition: [],
      obstacleimage: new window.Image(),
      image: new window.Image(),
      finishimage: new window.Image(),
      wait: 1,
      crashed: [],
      crashimg: new window.Image(),
      empty: new window.Image(),
      showModal: false,
      showStart: false,
      started: false,
      finished: false
    };
    this.channel
      .join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => {
        console.log("Unable to join", resp);
      });
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenStart = this.handleOpenStart.bind(this);
    this.handleCloseStart = this.handleCloseStart.bind(this);
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleOpenStart() {
    this.setState({ showStart: true });
  }

  handleCloseStart() {
    this.setState({ showStart: false });
  }

  alertWinner() {
    this.handleOpenModal();
  }

  alertStart() {
    this.handleOpenStart();
  }
  removealertStart() {
    this.handleCloseStart();
  }

  gotView(view) {
    this.setState(view.game);
    if (this.count == 0) {
      this.id = this.state.playerCount + 1;
      this.channel
        .push("playerCount", {
          playerCount: this.state.playerCount + 1,
          id: this.id
        })
        .receive("ok", this.gotView.bind(this));
      this.count = this.count + 1;
    }

    this.channel.on("playerActionsCompleted", msg => {
      this.setState({ playerInfo: msg.playerInfo });
      this.setState({ winner: msg.winner });
      this.setState({ wait: msg.wait });
      this.setState({ playerCount: msg.playerCount });
      this.setState({ crashed: msg.crashed });
      this.setState({ finished: msg.finished });
      if (this.state.winner > 0 && this.state.crashed.length == 0) {
        this.alertWinner();
      }
      if (this.state.crashed.length > 0) this.alertCrashed();

      if (this.state.playerCount == 2 && this.state.started == false) {
        this.setState({ showStart: true });
        setTimeout(
          () => this.setState({ showStart: false, started: true }),
          2500
        );
      }
    });
  }

  sendInfo(keyCode, id) {
    this.channel
      .push("playerActions", { keyCode: keyCode, id: id })
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

  _handleKeyDown(event) {
    event.preventDefault();
    if (this.state.started == true) {
      this.sendInfo(event.keyCode, this.id);
    }
  }

  alertwaiting() {
    alert("waiting for player 2");
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  alertCrashed() {
    setTimeout(this.handleOpenModal, 1500);
  }

  render() {
    let playerInfoAll = Object.values(this.state.playerInfo);
    let carlist = playerInfoAll.map((car, i) => (
      <Image
        key={i}
        image={this.state.image}
        width={80}
        height={40}
        x={car[0]}
        y={car[1]}
        ref={i}
      />
    ));

    let obstaclelist = this.state.obstaclePosition.map((obstacle, i) => (
      <Image
        key={i}
        image={this.state.obstacleimage}
        width={40}
        height={90}
        x={obstacle[0]}
        y={obstacle[1]}
        ref={i}
      />
    ));
    let finishline = this.state.finishPosition.map((finish, i) => (
      <Image
        key={i}
        image={this.state.finishimage}
        width={80}
        height={170}
        x={finish[0]}
        y={finish[1]}
        ref={i}
      />
    ));

    let crash = (
      <Image
        image={this.state.crashimg}
        width={80}
        height={80}
        x={this.state.crashed[0]}
        y={this.state.crashed[1]}
      />
    );

    let empty = (
      <Image image={this.state.empty} width={0} height={0} x={0} y={0} />
    );

    // console.log("crashed",this.state.crashed[0]);
    // console.log("winner",this.state.winner);
    return (
      <div>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <BgImage />
            {finishline}
            {obstaclelist}
            {carlist}
            {this.state.crashed.length > 0 ? crash : empty}
          </Layer>
        </Stage>
        <ReactModal
          isOpen={this.state.showModal}
          ariaHideApp={false}
          contentLabel="Minimal Modal Example"
        >
          <h1>{"The Winner is Player    " + this.state.winner + " !!!"} </h1>
          <a href=".." className="btn btn-primary">
            Play a New Game
          </a>
        </ReactModal>
        <ReactModal
          isOpen={this.state.showStart}
          ariaHideApp={false}
          contentLabel="Minimal Modal Start"
        >
          <div className="startModal">
            <h1> start game </h1>
          </div>
        </ReactModal>
        <div className="waiting-msg">
          {" "}
          {this.id > 2 ? (
            <div class="alert alert-success alert-dismissible">
              <a href="#" class="close" data-dismiss="alert" aria-label="close">
                &times;
              </a>
              You are only a Spectator
            </div>
          ) : (
            " "
          )}
        </div>
        <div className="waiting-msg">
          {" "}
          {this.state.wait  ? (
            <div class="alert alert-success alert-dismissible">
              <a href="#" class="close" data-dismiss="alert" aria-label="close">
                &times;
              </a>
              Waiting for Player 2 to join
            </div>
          ) : (
            " "
          )}
        </div>
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
    return (
      <Image
        image={this.state.image}
        width={window.innerWidth}
        height={800}
      />
    );
  }
}

//
// References
// https://github.com/lavrton/react-konva
// Professors notes from CS 5610
// http://www.ccs.neu.edu/home/ntuck/courses/2018/01/cs4550/notes/
// https://hexdocs.pm/phoenix/Phoenix.Channel.html
// https://stackoverflow.com/questions/29069639/listen-to-keypress-for-document-in-reactjs
// https://www.youtube.com/watch?v=t8nhPnMRwqo
// https://www.kirupa.com/canvas/moving_shapes_canvas_keyboard.htm
// Images and gif : https://giphy.com/gifs/turntables-139kYC03RSL8k
// https://www.google.com/search?rlz=1C5CHFA_enUS763US763&biw=1680&bih=976&tbm=isch&sa=1&ei=FIC6WsWbDtLYsQXGgL3ACQ&q=finish+line+png&oq=finish+line+png&gs_l=psy-ab.3..0j0i7i30k1l6j0i5i30k1.2974.2974.0.3198.1.1.0.0.0.0.117.117.0j1.1.0....0...1c.1.64.psy-ab..0.1.117....0.Ng4qUmlfN50#imgdii=y2gxOXWr5xZp7M:&imgrc=-A9AcNQgGEN1HM:
// 
