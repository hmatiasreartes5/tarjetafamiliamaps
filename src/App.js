import React,{Component,Fragment} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import './App.css';
import styled from '@emotion/styled';

const ContenedorHeader = styled.header`
    background-color:#26C6DA;
    padding: 10px;
    font-weight: bold;
    color:"FFFFFF";
`;

const TextoHeader = styled.h1`
    font-size: 2rem;
    margin:0;
    font-family: 'Slabo 27px', serif;
    text-align: center;
`;


class App extends Component {
  state = { 
    datos: [],
    infoMostrar : null
   }
 
   //Controla el ciclo de vida la API
  componentDidMount(){
    this.consultarDatos();
  };

  //Funcion Para cosumir la API 
  consultarDatos = async () => {
      const url = `https://tarjetafamilia.catamarca.gob.ar/api/v1/commerce/`;
      const respuesta = await fetch(url);
      const data = await respuesta.json();

      this.setState({
        datos: data.data 
      })  
      //console.log(data);    
  }
  //Fin Funcion consultarDatos

  //Funcion obtener Coordenadas
  obtenerCoordenadas = (point) =>{  
    if(point !== null){
      //latitudes y longitudes estan al revez en la API
      return [point.coordinates[1],point.coordinates[0]]
    }
    else return [0,0] 
  }
  //Fin funcion Obtener Coordenadas

  render() { 
    return ( 
      <Fragment>
        <ContenedorHeader>
            <TextoHeader>Ubicaciones Donde Reciben Tarjeta Familia</TextoHeader>
        </ContenedorHeader>

        <Map center={[-28.468799,-65.778930]} zoom={15}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          {this.state.datos.map(dato =>(
            <Marker 
              key={dato.id}
              position={this.obtenerCoordenadas(dato.attributes.point)}
              onclick = {()=>{
                  this.setState({
                    infoMostrar : dato.attributes
                  })
              }}
            />
          ))}

          {this.state.infoMostrar ? 

            <Popup
              position={this.obtenerCoordenadas(this.state.infoMostrar.point)}
              onClose={()=>{
                this.setState({
                  infoMostrar: null
                })
              }}
            >
              <div>
                <p>Lugar: <span>{this.state.infoMostrar.name}</span></p>
                <p>Direccion: <span>{this.state.infoMostrar.address}</span></p>
              </div>
            </Popup>
            :null
          }

        </Map>
      </Fragment>
     );
  }
}
 
export default App;