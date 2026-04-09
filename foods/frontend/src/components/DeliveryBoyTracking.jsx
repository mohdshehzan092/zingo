import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

const delivreyBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});
const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});
const DeliveryBoyTracking = ({ data }) => {
  const deliveryBoyLat = data.deliveryBoyLocation.lat;
  const deliveryBoyLon = data.deliveryBoyLocation.lon;
  const customerLat = data.customerLocation.lat;
  const customerLon = data.customerLocation.lon;

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];
  const center = [deliveryBoyLat, deliveryBoyLon];
  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer
        className={"w-full h-full"}
        zoom={18}
        center={center}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={delivreyBoyIcon}>
            <Popup>Delivery Boy</Popup>
        </Marker>
        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
            <Popup>Home</Popup>
        </Marker>
        <Polyline positions={path} color="blue" weight={4}/>
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;
