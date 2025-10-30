import axios from 'axios';
import {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function Starlink() {
    const [satelites,setSatelites] = useState([]);
    const [paginaAtual,setPaginaAtual] = useState(1);
    
    useEffect(()=> {
        fetchSatelites(paginaAtual);
    }, []);

    const fetchSatelites = async (pagina) => {
        const response = await axios.post('https://api.spacexdata.com/v4/starlink/query', 
        {
            "query": {},
            "options": { 
                limit:100,
                page:pagina 
            }
        });
        setSatelites((antigos) => [...antigos, ...response.data.docs]);
        console.log(response.data);
    }

    const carregarProximaPagina = () => {
        setPaginaAtual(paginaAtual + 1);
        fetchSatelites(paginaAtual);
    }


    

    const ocean = [-3.0925454075226755, -60.0185281];

    return (
        <>
            <h1>Lista de Satélites starlink. Total: {satelites.length}</h1>
            {/* <ul>
                {satelites
                    .filter((sat) => sat.latitude && sat.longitude)
                    .map((sat) => (
                    <li key={sat.id}>{sat.spaceTrack.OBJECT_NAME} LAT {sat.latitude}  LONG{sat.longitude}</li>
                ))}
            </ul> */}
            <MapContainer center={ocean} zoom={2} scrollWheelZoom={false} style={{height: '70vh'}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {satelites
                    .filter((sat) => sat.latitude && sat.longitude)
                    .map((sat) => (
                        <Marker 
                            key={sat.id}
                            position={[sat.latitude, sat.longitude]}>
                                <Popup>
                                    {sat.spaceTrack.OBJECT_NAME}
                                </Popup>
                        </Marker>
                ))}
            </MapContainer>
            <h3>Página atual:{paginaAtual}</h3>
            <button onClick={carregarProximaPagina}>Próxima página</button>
        </>
    )
}

export default Starlink;