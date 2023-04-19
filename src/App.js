import './App.css';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo'
import React from 'react';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import Rank from './component/Rank/Rank';
import ParticlesBg from 'particles-bg';
import Signin from './component/Signin/Signin';
import Register from './component/Register/Register';


const initialState = {
  input : '',
  ImageUrl : '',
  Box : [],
  numFaces: 0,
  route : 'signin',
  user : {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super()
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    if (!data || !data.outputs) {
      return [];
    }
  
    const regions = data.outputs[0].data.regions;
    const image = document.getElementById('Image');
    const width = Number(image.width);
    const height = Number(image.height);
  
    return regions.map(region => {
      const clarifaiFace = region.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    });
  }

  displayFaceBoxes = (boxes) => {
    const facecount = boxes.length;
    this.setState({ Box: boxes }, () => {
      this.setState({ numFaces: facecount });
    });
  };

  onInputChange = (event) =>{
    this.setState({ImageUrl : event.target.value});
    this.setState({ Box: [] });
    this.setState({numFaces: 0});
  }

  onButtonSubmit = () => {
    fetch('https://smartbrainserver-fhye.onrender.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ImageUrl: this.state.ImageUrl
      })
    })
      .then(response => response.json()) // <-- Fix here
      .then(result => {
        if (result && result.outputs && result.outputs.length > 0) {
            fetch('https://smartbrainserver-fhye.onrender.com/image', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: this.state.user.id
                })
            })
            .then(response => response.json())
            .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)

            const faceLocations = this.calculateFaceLocation(result)
            this.displayFaceBoxes(faceLocations)
        }
    })
    .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    this.setState({route : route})
    if (route === 'signin') {
      this.setState(initialState)
    } else if (route === 'register') {
      this.setState(initialState);
      this.setState({route : 'register'})
    }
  }

  calculateNumParticles = () => {
    const screenWidth = window.innerWidth;
    console.log(screenWidth)
    let numParticles = 0;

    if (screenWidth >= 1200) {
      numParticles = 200;
    } else if (screenWidth >= 992) {
      numParticles = 150;
    } else if (screenWidth >= 768) {
      numParticles = 100;
    } else {
      numParticles = 50;
    }

    return numParticles;
  };


  render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" num={this.calculateNumParticles()} bg={true} color='#FFFFFF'/>
        { this.state.route === 'home'  
        ?  <div>
              <Navigation onRouteChange = {this.onRouteChange} />
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange = {this.onInputChange}
                onButtonSubmit = {this.onButtonSubmit}
              />
              <FaceRecognition ImageUrl = {this.state.ImageUrl} box={this.state.Box}/>
              <div className='numFaces'>
                {this.state.numFaces ? `Number of faces detected: ${this.state.numFaces}` : ''}
              </div>
            </div>
        : (
          this.state.route === 'signin'
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
        )
        }
      </div>
    );
  }
}

export default App;
