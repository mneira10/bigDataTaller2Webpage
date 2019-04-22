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
import prCurve from './images/prCurve.png'
import cmPolarity from './images/notNormalizedBasicClassification.png'
import cmPolarityNorm from './images/normalizedBasicClassification.png'
import electronicsCM from './images/electronics_cm.png'
 
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
        <Chart title="Derivative - dfollowers/dt" ylabel="Followers/hour" data={this.state.data['derivative']} /* onRef={ref => this.chart = ref} */ />
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
        Mauricio Neira
        <br/>
        Maria Camila Hernández
        <br/>
        William Sanchez
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

        <div className='ajustar'>
          El modelo utilizado se basó en <a href="https://github.com/aylliote/senti-py">este repositorio</a>. 
          El modelo de análisis de sentimientos consiste de 4 etapas.
  
          <ol>
            <li>Se preprocesa el texto </li>
            <br/>
            <li>Pasar el tweets a una versión vectorizada utilizando <a href="https://galaxydatatech.com/2018/11/19/feature-extraction-with-tf-idf/">TF-IDF</a> (Term Frequency – Inverse Document Frequency ) usando la <a href="https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html">implementación de scikit-learn</a>.</li>
            <br/>
            <li>El paso anterior va a producir una matrix de Nxn. Donde N es la cantidad de tweets en la base de datos y n la cantidad de features. Dado que esa matriz es extremadamente esparsa, este paso reduce n para reducir la dimensionalidad del espacio de caracteristicas y acelara el proceso de clasificación.</li>
            <br/>
            <li>Se implementa <a href="https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.MultinomialNB.html">Multinomial Naive Bayes</a> sobre ese espacio de caracteríscitas. Se usa GridSearch K con  K = 10 como cross validación para encontrar el clasificador óptimo en el espacio de hiperparámetros.</li>
          </ol>

          El resultado es un clasificador que toma un tweet y predice un valor entre 0 y 1 donde 0 es un tweet extremadamente negativo, 1 un tweet extremadamente positivo y los valores intermedios valores intermedios de polaridad. 
        </div>

        <h3>Evaluación de la calidad del modelo</h3>

        <div className='ajustar'>
          La evaluación del modelo se hizo sobre los datos encontrados en <a href="https://github.com/NatashaSvic/NLP_Spanish_Sentiment_Anaylsis_Text_Generation">este repositorio</a>. Este trabajo se basó en recolectar y anotar una gran cantidad de tweets alrededor de las elecciones presidenciales del 2018. Se usó <a href="https://raw.githubusercontent.com/NatashaSvic/NLP_Spanish_Sentiment_Anaylsis_Text_Generation/master/TASS_data/general_corpus_2012/general-train-tagged-3l.xml">este archivo</a> del repositorio para evaluar el comportamiento del clasificador. Consta de las siguientes anotaciones:
        </div>
        
        
        <br/>
        <div className="ajustarYCentrar">
          <table className="tg">
          <tbody>
            <tr>
              <th className="tg-88nc">Label</th>
              <th className="tg-88nc">Cantidad</th>
            </tr>
            <tr>
              <td className="tg-uys7">P</td>
              <td className="tg-uys7">2884</td>
            </tr>
            <tr>
              <td className="tg-uys7">N</td>
              <td className="tg-uys7">2182</td>
            </tr>
            <tr>
              <td className="tg-uys7">NEU</td>
              <td className="tg-uys7">670</td>
            </tr>
            <tr>
              <td className="tg-88nc">Total</td>
              <td className="tg-uys7">5736</td>
            </tr>
            </tbody>
          </table>
          
        </div>
        <br/> 
        <div className='ajustar'>
          Para poder evaluar el modelo, fue necesario discretizar el espacio de salida del clasificador (el intervalo [0,1]) en 3 valores: positivo ('P'), negativo ('N') y neutral ('NEU'). Para hacer eso, se establecieron 2 umbrales i,j donde  \(i \le j \). De esta forma, todo tweet con score de polaridad \(p\), se clasifica de la siguiente forma: si \(p\le i\) se clasifica como 'N', si \(p\le j \wedge p\ge i\) se clasifica como 'NEU' y si \(p\ge j\) se clasifica como 'P'. 
          <br/>
          <br/>

          De esta forma, para cada cada par de valores \(i,j\) se tiene una matriz de confusión que describe el desempeño del algoritmo. A partir de esta matriz de confusión se puede extraer la precisión y la cobertura para cada una de las anotaciones y se puede construir una curva de precisión y cobertura. Ésta se muestra a continuación: 

        </div>

        <img src={prCurve} alt="Curva de precision y cobertura" width="900" />
        
        <div className='ajustar'>
          A partir de la curva, es claro que para todo régimen operativo, el algoritmo clasifica mejor los tweets positivos seguido de tweets negativos y finalmente, tweets neutros. Es posible que este comportamiento esté dado por la facilidad de correlacionar un vocabulario positivo con un tweet positivo mientras que un tweet negativo no es facilmente clasificable como negativo pues hay factores adicionales a considerar como la sátira, la ironía y el sarcasmo. 
          <br/>
          <br/>
          Los tweets neutros son los más difíciles de clasificar pues se encuentran en la mitad de los 2 extremos de polaridad como se evidencia por la cercanía de los puntos verdes al origen. 
          <br/>
          <br/>
          Vemos que el mejor accuracy obtenido a lo largo de toda la curva es de 0.72 (representado por los puntos rojos en la gráfica), considerablemente más alto que si el algoritmo adivinara (donde tendría un accurace de 0.33). 
          <br/>
          <br/>
          Ahora bien, nuestro critero para escoger el mejor par \(i,j\) fue el F1 score. El F1 se define como 
        </div>

        <br/>
        \(F1=2\cdot \frac{'{'}precision\cdot recall{'}'}{'{'} precision+recall{'}'}\)
        <br/>
        <br/>

        <div className='ajustar'>
          Esto es el promedio harmónico entre la precision y la cobertura. Maximizar el promedio este valor a través de las anotaciones implica maximizar la precisión  y la cobertura de forma conjunta, priorizando valores similares de precisión y cobertura. Los puntos correspondientes a la F1 máxima son negros en la gráfica. A continuación se muestran la matrices de confusión estándar y normalizadas asociadas a estos puntos:
        </div>
        <img src={cmPolarity} alt="Curva de precision y cobertura"                 height="350" />
        <img src={cmPolarityNorm} alt="Curva de precision y cobertura normalizada" height="350" />


        <div className='ajustar'>
          A la izquierda se encuentra la matriz de confusión estándar y a la derecha la matriz de confusión normalizada por columnas para que se evidencie de forma más tangible las confusiones por categoría. De ahí se puede ver fácilmente que la clase con las que más se confunden las clases positivas y negativas es la clase neutra. Esto tiene sentido pues la clase neutra es la que se encuentra más cerca a cada una de ellas. Por otro lado, vemos que los tweets neutros se confunden casi siempre con tweets negativos. Las métricas asociadas son:
        </div>

        <h2>Análisis del histórico de seguidores en las cuentas, cuentas robot</h2>
        <h3>Análisis del histórico de seguidores en las cuentas</h3>
        <div className='ajustar'>
        Para visualizar los seguidores históricos, ingrese el nombre del usuario que desea buscar. 
        Por ejemplo: AlvaroUribeVel, IvanDuque y Bogota.
        </div>
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

        <h3>Matriz de confusión para electrónicos</h3>
        <img src={electronicsCM} alt="Matriz de confusion para electronicos" height="400" />
      </div>
    );
  }
}

export default App;
