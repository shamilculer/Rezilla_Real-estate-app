import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import SetMapCenter from "./SetMapCenter";
import "leaflet/dist/leaflet.css";
import L from "leaflet"
import { Link } from "react-router-dom";

const Map = ({listings}) => {

    const createCustomIcon = (price, type) => {
        return L.divIcon({
            html: `<div class="">$ ${price}<span class="text-[10px]" >${type === "rent" ? "/month" : "/-"}</span></div>`,
            className : 'custom-marker bg-white flex items-center justify-center rounded-xl border border-gray-[700] shadow-2xl text-base font-semibold min-w-max',
            iconSize: [120, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        })
    }

    const center = listings.length > 0 && listings[0].lat ? [listings[0].lat, listings[0].long] : [52.4797, -1.90269]

    return (
        <MapContainer
            center={center}
            zoom={10}
            scrollWheelZoom={false}
            
            className="w-full h-full min-h-80 xl:min-h-96 rounded-md"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <SetMapCenter center={center} />

            {listings.map((listing, index) => (

                <Marker 
                    key={listing?.id || index} 
                    position={listings.length > 0 && listings[0].lat ? [listing.lat, listing.long] : [51.505, -0.09]}
                    icon={createCustomIcon(listing.price, listing.type)}
                    
                    >
                    <Popup>
                        <Link to={`/listing/${listing?._id}`} className="bg-white w-60 rounded-md flex flex-col items-center justify-center">
                            <div className="min-h-[200px] w-full bg-center bg-cover bg-no-repeat rounded-lg" style={{ backgroundImage: `url(${listing.images && listing.images[0]})` }} ></div>
                            <div className="p-3">
                                <h3 className="font-medium capitalize text-sm overflow-hidden line-clamp-2" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical" }}>{listing.title}</h3>

                                <h5 className="mt-4 font-semibold text-sm text-color1" >$ {listing.price}/<span className="text-sm font-medium text-text-color-3" >Month</span></h5>
                            </div>
                        </Link>
                    </Popup>
                </Marker>

            ))}

        </MapContainer>
    )
}

export default Map