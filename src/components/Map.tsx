import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
	useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeoLocation";
import { Button } from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

const Map = () => {
	const { cities } = useCities();
	const [mapPosition, setMapPosition] = useState<[number, number]>([40, 0]);
	const {
		isLoading: isLoadingPosition,
		position: geoLocationPosition,
		getPosition,
	} = useGeolocation();

	const [mapLat, mapLng] = useUrlPosition();

	useEffect(() => {
		if (mapLat && mapLng) setMapPosition([Number(mapLat), Number(mapLng)]);
	}, [mapLat, mapLng]);

	useEffect(() => {
		if (geoLocationPosition)
			setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
	}, [geoLocationPosition]);

	return (
		<div className={styles.mapContainer}>
			{!geoLocationPosition && (
				<Button type="position" onClick={getPosition}>
					{isLoadingPosition ? "Loading..." : "Use your position"}
				</Button>
			)}
			<MapContainer
				//@ts-ignore
				center={mapPosition}
				zoom={6}
				scrollWheelZoom={true}
				className={styles.map}
			>
				<TileLayer
					//@ts-ignore
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
				/>
				{cities.map((city) => (
					<Marker position={[city.position.lat, city.position.lng]} key={city.id}>
						<Popup>
							<span>{city.emoji}</span>
							<span>{city.cityName}</span>
						</Popup>
					</Marker>
				))}
				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	);
};

function ChangeCenter({ position }: { position: [number, number] }) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectClick() {
	const navigate = useNavigate();

	useMapEvents({
		click: (e: any) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
	});
	return null;
}

export default Map;
