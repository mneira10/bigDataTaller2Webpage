import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import * as d3 from "d3";
import Chart from './chart'


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


      
      </div>
    );
  }
}

export default App;
