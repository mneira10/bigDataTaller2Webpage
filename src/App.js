import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import * as d3 from "d3";
import Chart from './chart'
import appCla from './images/AppClasificacion.JPG'
import appDoc from './images/AppDoc.JPG'
import automotiveDoc from './images/AutomotiveDoc.JPG'
import automotiveCla from './images/AutomotiveClasificacion.JPG'
import babyDoc from './images/BabyDoc.JPG'
import babyCla from './images/BabyClasificacion.JPG'
import beautyDoc from './images/BeautyDoc.JPG'
import beautyCla from './images/BeautyClasificacion.JPG'
import booksDoc from './images/BooksDoc.JPG'
import booksCla from './images/BooksClasificacion.JPG'
import cdDoc from './images/CDDoc.JPG'
import cdCla from './images/CDClasificacion.JPG'
import cellphonesDoc from './images/CellphonesDoc.JPG'
import cellphonesCla from './images/CellphonesClasificacion.JPG'
import clothingDoc from './images/ClothingDoc.JPG'
import clothingCla from './images/ClothingClasificacion.JPG'
import digitalMusicaDoc from './images/DigitalMusicDoc.JPG'
import digitalMusicaCla from './images/DigitalMusicClasificacion.JPG'
import electronicsDoc from './images/ElectronicsDoc.JPG'
import electronicsCla from './images/ElectronicsClasificacion.JPG'
import groceryFoodDoc from './images/GroceryFoodDoc.JPG'
import groceryFoodCla from './images/GroceryFoodClasificacion.JPG'
import healthDoc from './images/HealthDoc.JPG'
import healthCla from './images/HealthClasificacion.JPG'
import homeDoc from './images/HomeDoc.JPG'
import homeCla from './images/HomeClasificacion.JPG'
import kindleDoc from './images/KindleDoc.JPG'
import kindleCla from './images/KindleClasificacion.JPG'
import moviesDoc from './images/MoviesDoc.JPG'
import moviesCla from './images/MoviesClasificacion.JPG'
import musicalDoc from './images/MusicalInstruments.JPG'
import musicalCla from './images/MusicalInstrumentsClasificacion.JPG'
import officeDoc from './images/OfficeProductsDoc.JPG'
import officeCla from './images/OfficeProdcutsClasificacion.JPG'
import patioDoc from './images/PatioGardenDoc.JPG'
import patioGardenCla from './images/PatioGardenClasificacion.JPG'
import petSuppliesDoc from './images/PetSuppliesDoc.JPG'
import petSuppliesCla from './images/PetSuppliesClasificacion.JPG'
import sportsDoc from './images/SportsDoc.JPG'
import sportsCla from './images/SportsClasificacion.JPG'
import toolsDoc from './images/ToolsDoc.JPG'
import toolsCla from './images/ToolsClasificacion.JPG'
import toysDoc from './images/ToysDoc.JPG'
import toysCla from './images/ToysClasificacion.JPG'
import videoGamesDoc from './images/VideoGamesDoc.JPG'
import videoGamesCla from './images/VideoGamesClasificacion.JPG'
import videosDoc from './images/Videos_doc.JPG'
import videosCla from './images/VideosClasificacion.JPG'




class App extends Component {

  constructor(props) {
    super(props);
    this.state = {render: false,displayPolarities:false};

    this.usernameInput = React.createRef();
    this.usernameInputPolarities = React.createRef();

    this.getTweets = this.getTweets.bind(this);
    this.getPolarities = this.getPolarities.bind(this);
  }

  getPolarities(){
    console.log('getting polarities...');
    let username = this.usernameInputPolarities.current.value;
    axios.get(`http://172.24.101.43:8080/userPolarity/`+username)
      .then(res => {
        let data = res.data;
        
        data = data.map((x) => {
          return {
            x:new Date(x.created_at),
            y:x.myBasicPolarity*2 -1 
          };
        });

        
        console.log(data);
        // data['original'] = data['original'].sort((a,b)=>a.x-b.x)
        var histGenerator = d3.histogram()
        .domain([-1,1])    // Set the domain to cover the entire intervall [0;]
        .thresholds(9); 
        let normedPolarities = data.map((x)=>x.y);
        console.log(normedPolarities)
        var bins = histGenerator(normedPolarities);


        let histoData = bins.map((x)=>{
          return(
            {
              y :x.length,
              // label: x.x0+(x.x1-x.x0)/2
              label: String(x.x0.toFixed(2))+'...'+String(x.x1.toFixed(2))
            }
          )
        })
        data = {'original':data,'histoData':histoData}
        console.log('bins');
        console.log(bins);
        this.setState({
          displayPolarities:true,
          dataPolarities: data
        });
      })
  }
  
  getTweets(){
    console.log('gettingTweets');
    let username = this.usernameInput.current.value;
    console.log(username);
    axios.get(`http://172.24.101.43:8080/userFollowers/`+username)
      .then(res => {
        let data = res.data;
        console.log(data);

        data['original'] = data['original'].map((x) => {
          return {
            x:new Date(x.created_at),
            y:x.user.followers_count
          };
        })


        data['derivative'] = data['derivative'].map((x) => {
          return {
            x:new Date(x.x),
            y:x.y
          };
        })

        data['original'] = data['original'].sort((a,b)=>a.x-b.x)

        

        this.setState({
          render:true,
          data: data
        });
        // this.setState({ persons });
      })

  }
  render() {
    
    let chart;
    let polarityChart;
    if(this.state.render){
     
      chart= <div>
        Retrieved <b>{this.state.data['original'].length}</b>  tweets for user <b>{this.usernameInput.current.value}</b>.
        <br/>
        <Chart title="Followers in time" ylabel="Followers" data={this.state.data['original']} /* onRef={ref => this.chart = ref} */ />
        <Chart title="Derivative of followers" ylabel="Followers/hour" data={this.state.data['derivative']} /* onRef={ref => this.chart = ref} */ />
      </div>;
    }
    else {
      chart= <p></p>
    }

    if(this.state.displayPolarities){
      polarityChart = <div>
        Retrieved <b>{this.state.dataPolarities['original'].length}</b>  tweets for user <b>{this.usernameInputPolarities.current.value}</b>.
        <br/>
        <Chart title="Tweet polarities in time" ylabel="Polarity" data={this.state.dataPolarities['original']} style="scatter"/* onRef={ref => this.chart = ref} */ />
        <Chart title="Histogram of polarities" ylabel="Frequency" data={this.state.dataPolarities['histoData']} style="column"/* onRef={ref => this.chart = ref} */ />
      </div>
    }
    else{
      polarityChart=<p></p>
    }
    return (
      <div className="App">
       
        <h1>Taller 2</h1>
        <h2>Análisis de polaridad de tweets</h2>
        <h3>Anotación de datos</h3>
        Para visualizar la polaridad de los tweets de un usuario, ingrese el nombre del usuario que desea buscar. 
        <br/>
        Por ejemplo: AlvaroUribeVel, IvanDuque y Bogota.
        <br/>
        <br/>
        <input type='text' ref={this.usernameInputPolarities}></input>
        <br/>
        <button onClick={this.getPolarities}>Visualizar</button>
        <br/>
        <br/>
        {polarityChart}

        <h3>Modelo de análisis de sentimientos</h3>
        <h3>Evaluación de la calidad del modelo</h3>

        <h2>Análisis del histórico de seguidores en las cuentas, cuentas robot</h2>
        
        Para visualizar los seguidores históricos, ingrese el nombre del usuario que desea buscar. 
        Por ejemplo: AlvaroUribeVel, IvanDuque y Bogota.

        <br/>
        <br/>
        <input type='text' ref={this.usernameInput}></input>
        <br/>
        <button onClick={this.getTweets}>Visualizar</button>
        <br/>
        <br/>
        {chart}

        <h2>Análisis de apoyo, contradiccion o matoneo</h2>
        <h2>Análisis de polaridad sobre un dataset anotado</h2>

        <h3>Books</h3>
        <h5>3.145.725 reviews</h5>
        <img src={booksDoc} alt="Books Documentos" height="250" />
        <img src={booksCla} alt="Books Clasificacion" height="250" />

        <h3>Electronics</h3>
        <h5>1.048.575 reviews</h5>
        <img src={electronicsDoc} alt="Electronics Documentos" height="250" />
        <img src={electronicsCla} alt="Electronics Clasificacion" height="250" />

        <h3>Movies and TV</h3>
        <h5>1.048.575 reviews</h5>
        <img src={moviesDoc} alt="Movies Documentos" height="250" />
        <img src={moviesCla} alt="Movies Clasificacion" height="250" />

        <h3>CDs and Vinyl</h3>
        <h5>1.048.575 reviews</h5>
        <img src={cdDoc} alt="CDs Documentos" height="250" />
        <img src={cdCla} alt="CDs Clasificacion" height="250" />

        <h3>Clothing, Shoes and Jewelry</h3>
        <h5>278.677 reviews</h5>
        <img src={clothingDoc} alt="Clothing Documentos" height="250" />
        <img src={clothingCla} alt="Clothing Clasificacion" height="250" />

        <h3>Home and Kitchen</h3>
        <h5>424.329 reviews</h5>
        <img src={homeDoc} alt="Home Documentos" height="250" />
        <img src={homeCla} alt="Home Clasificacion" height="250" />

        <h3>Kindle Store</h3>
        <h5>982.619 reviews</h5>
        <img src={kindleDoc} alt="Kindle Documentos" height="250" />
        <img src={kindleCla} alt="Kindle Clasificacion" height="250" />

        <h3>Sports and Outdoors</h3>
        <h5>296.336 reviews</h5>
        <img src={sportsDoc} alt="Sports Documentos" height="250" />
        <img src={sportsCla} alt="Sports Clasificacion" height="250" />
        
        <h3>Cellphones and Accesories</h3>
        <h5>194.439 reviews</h5>
        <img src={cellphonesDoc} alt="Cellphones Documentos" height="250" />
        <img src={cellphonesCla} alt="Cellphones Clasificacion" height="250" />

        <h3>Health and Personal Care</h3>
        <h5>346.355 reviews</h5>
        <img src={healthDoc} alt="Health Documentos" height="250" />
        <img src={healthCla} alt="Health Clasificacion" height="250" />

        <h3>Toys and Games</h3>
        <h5>167.597 reviews</h5>
        <img src={toysDoc} alt="Toys Documentos" height="250" />
        <img src={toysCla} alt="Toys Clasificacion" height="250" />

        <h3>Video Games</h3>
        <h5>231.780 reviews</h5>
        <img src={videoGamesDoc} alt="VideoGames Documentos" height="250" />
        <img src={videoGamesCla} alt="VideoGames Clasificacion" height="250" />

        <h3>Tools and Home Improvement</h3>
        <h5>134.476 reviews</h5>
        <img src={toolsDoc} alt="Tools Documentos" height="250" />
        <img src={toolsCla} alt="Tools Clasificacion" height="250" />
     
        <h3>Beauty</h3>
        <h5>198.502 reviews</h5>
        <img src={beautyDoc} alt="Beauty Documentos" height="250" />
        <img src={beautyCla} alt="Beauty Clasificacion" height="250" />

        <h3>Apps for Android</h3>
        <h5>752.937 reviews</h5>
        <img src={appDoc} alt="App Documentos" height="250" />
        <img src={appCla} alt="App Clasificacion" height="250" />

        <h3>Office Products</h3>
        <h5>53.258 reviews</h5>
        <img src={officeDoc} alt="Office Documentos" height="250" />
        <img src={officeCla} alt="Office Clasificacion" height="250" />

        <h3>Pet Supplies</h3>
        <h5>157.836 reviews</h5>
        <img src={petSuppliesDoc} alt="Pet Documentos" height="250" />
        <img src={petSuppliesCla} alt="Pet Clasificacion" height="250" />

        <h3>Automative</h3>
        <h5>20.473 reviews</h5>
        <img src={automotiveDoc} alt="Automative Documentos" height="250" />
        <img src={automotiveCla} alt="Automative Clasificacion" height="250" />

        <h3>Grocery and Gourmet Food</h3>
        <h5>151.254 reviews</h5>
        <img src={groceryFoodDoc} alt="Grocery Documentos" height="250" />
        <img src={groceryFoodCla} alt="Grocery Clasificacion" height="250" />

        <h3>Patio, Lawn and Garden</h3>
        <h5>13.272 reviews</h5>
        <img src={patioDoc} alt="Patio Documentos" height="250" />
        <img src={patioGardenCla} alt="Patio Clasificacion" height="250" />

        <h3>Baby</h3>
        <h5>160.792 reviews</h5>
        <img src={babyDoc} alt="Baby Documentos" height="250" />
        <img src={babyCla} alt="Baby Clasificacion" height="250" />

        <h3>Digital Music</h3>
        <h5>64.706 reviews</h5>
        <img src={digitalMusicaDoc} alt="Digital Music Documentos" height="250" />
        <img src={digitalMusicaCla} alt="Digital Music Clasificacion" height="250" />

        <h3>Musical Instruments</h3>
        <h5>10.261 reviews</h5>
        <img src={musicalDoc} alt="Music Documentos" height="250" />
        <img src={musicalCla} alt="Music Clasificacion" height="250" />

        <h3>Amazon Instant video</h3>
        <h5>37.127 reviews</h5>
        <img src={videosDoc} alt="Videos Documentos" height="250" />
        <img src={videosCla} alt="Videos Clasificacion" height="250" />

      </div>
    );
  }
}

export default App;
