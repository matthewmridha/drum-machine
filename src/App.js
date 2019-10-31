import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

// remove focus for mouse users

document.body.addEventListener( "mousedown", function() {
  document.body.classList.add( "usingMouse" );
});
document.body.addEventListener( "keydown", function() {
  document.body.classList.remove( "usingMouse" );
});

// AUDIO

const drumPads = [
  {
    keyCode: 81,
    keyTrigger: "Q",
    id: "Heater-1",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
  },
  {
    keyCode: 87,
    keyTrigger: "W",
    id: "Heater-2",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
  },
  {
    keyCode: 69,
    keyTrigger: "E",
    id: "Heater-3",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
  },
  {
    keyCode: 65,
    keyTrigger: "A",
    id: "Heater-4",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
  },
  {
    keyCode: 83,
    keyTrigger: "S",
    id: "Clap",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
  },
  {
    keyCode: 68,
    keyTrigger: "D",
    id: "Open-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
  },
  {
    keyCode: 90,
    keyTrigger: "Z",
    id: "Kick-n'-Hat",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
  },
  {
    keyCode: 88,
    keyTrigger: "X",
    id: "Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
  },
  {
    keyCode: 67,
    keyTrigger: "C",
    id: "Closed-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
  }
];

// styles for buttons default and active

const InactiveStyle = {
  backgroundColor: "grey",
  boxShadow: "3px 3px black"
};

const ActiveStyle = {
  backgroundColor: "red",
  boxShadow: "1px 1px black"
};


// main component

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      volume: 0.5,
      button: "",
      style: InactiveStyle,
      power: false,
    };
    this.handleKeyPress = this.handleKeyPress.bind( this );
    this.playAudio = this.playAudio.bind( this );
    this.handleClick = this.handleClick.bind( this );
    this.handleVolume= this.handleVolume.bind( this );
    this.handlePower = this.handlePower.bind( this );
  };
  
  componentDidMount() {
    document.addEventListener( "keydown", this.handleKeyPress );
  };
  
  componentWillUnmount() {
    document.removeEventListener( "keydown", this.handleKeypress );
  };
  
  // power on/off
  
  handlePower(){
    this.setState( state => {
      return { power : !this.state.power }
    })
     document.querySelector("#power").classList.add("powerClick");
    setTimeout( () => { 
      document.querySelector("#power").classList.remove("powerClick"); 
    }, 100);
    if( this.state.power ) {
      this.setState( state => {
        return { display : "", }
      });      
    }
  };
  
  // play audio / animate keys / update display
  
   playAudio = ( key, tag ) => {
    const audio = document.getElementById( key );
    audio.volume = this.state.volume;
    if( this.state.power ) {
      audio.currentTime = 0;
      audio.play();
      this.setState( state => {
      return { display: tag.replace( /-/g, " " ) };
    });
    }
    document.getElementById( tag ).classList.add( "activeStyle" );
    setTimeout( () => {
      document.getElementById( tag ).classList.remove( "activeStyle" );
    }, 100 );
  };

// Volume control

handleVolume = ( event ) => {
  if( this.state.power ){
    const newVol = parseFloat( event.target.value).toFixed( 2 );
    this.setState( state => { return { volume : newVol };
    });
        
  }
};

// clicking on drum pad

  handleClick = ( e, data ) => {
    const key = e.target.dataset.value;
    const tag = e.target.id;
    this.playAudio( key, tag );
  };

// using keyboard to play drumpad

  handleKeyPress = e => {
    drumPads.map( item => {
      if ( e.keyCode === item.keyCode ) {
        const key = item.keyTrigger;
        const tag = item.id;
        this.playAudio( key, tag )
      }
      else {
        return false;
      }
    });
  };

  render() {
    return (
      <div className="drum-machine" id="drum-machine">
        <div className="drum-pad-wrapper">
          {drumPads.map( (item, index) => (
            <button
              key={item.id}
              className="drum-pad"
              id={ item.id }
              data-value={ item.keyTrigger }
              onClick={ this.handleClick }
            >
              {item.keyTrigger}
              <audio className="clip" 
                id={ item.keyTrigger } 
                src={ item.url } />
            </button>
            
          ))}
        </div>
        <div className="sideBar">
          <Display 
            display={ this.state.display } 
            volumeDisplay={ this.state.power ? "VOL " + ( this.state.volume * 100 ).toFixed( 0 ) : "" }
            />
          <div id="controls">
          <Volume 
            volumeDisplay={ this.state.power ? ( this.state.volume * 100 ).toFixed( 0 ) : "" } 
            handleVolume={ this.handleVolume } 
            value={ this.state.volume }/>
          <Power 
            handlePower={ this.handlePower } 
            power={ this.state.power }/>
          </div>
        </div>
      </div>
    );
  }
};

// Display componenet

const Display = props => {
  return (
    <div className="display sidebarItems" id="display">
      <div id="keyDisplay"><h3>{ props.display }</h3></div>
      <div id="volSection"><div id="value"><h5> {props.volumeDisplay}</h5></div></div>
    </div>
  );
};

// Volume component

const Volume = ( props ) => {
  return(
    <div className="sidebarItems volumeArea">
    <div className="slideContainer" id="display">
      <input 
        type="range" 
        min="0.00" 
        max="1.00" 
        step="0.01" 
        class="slider" 
        value={ props.volume } 
        id="range" 
        onChange={ props.handleVolume }/>
    </div>
      
      </div>
  );
};

// Power componenet

class Power extends React.Component {
  render() {
    return(
    <div>
      <button 
        style={{ color: this.props.power === true ? "green" : "red" }} 
        className="power" id="power" 
        onClick={ this.props.handlePower }>
        <i class="fa fa-power-off" aria-hidden="true"></i>
      </button>
    </div>
  );
  }
};


export default App;