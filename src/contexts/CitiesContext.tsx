import React, { createContext, useContext, useEffect, useState } from "react";
export interface City {
	cityName: string;
	country: string;
	emoji: string;
	date: string;
	notes: string;
	position: {
		lat: string;
		lng: string;
	};
	id: string;
}
interface CitiesContextType {
	cities: City[];
	isLoading: boolean;
	currentCity: City | null;
	getCity: (id: string) => void;
	createCity: (newCity: City) => void;
	deleteCity: (id: string) => void;
}
const defaultContextValue: CitiesContextType = {
	cities: [],
	isLoading: false,
	currentCity: null,
	getCity: async () => {},
	createCity: async () => {},
	deleteCity: async () => {},
};
const CitiesContext = createContext<CitiesContextType>(defaultContextValue);
const BASE_URL = "http://localhost:8000";

function CitiesProvider({ children }: { children: React.ReactNode }) {
	const [cities, setCities] = useState<City[]>([] as City[]);
	const [isLoading, setLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState<City | null>(null);

	useEffect(() => {
		const fetchCities = async () => {
			try {
				setLoading(true);
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				setCities(data);
			} catch (err) {
				alert("Error fetching cities");
			} finally {
				setLoading(false);
			}
		};
		fetchCities();
	}, []);

	async function getCity(id: string) {
		try {
			setLoading(true);
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			setCurrentCity(data);
		} catch (err) {
			alert("Error fetching city");
		} finally {
			setLoading(false);
		}
	}

	async function createCity(newCity: City) {
		try {
			setLoading(true);
			const res = await fetch(`${BASE_URL}/cities/`, {
				method: "POST",
				body: JSON.stringify(newCity),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			setCities((cities) => [...cities, data]);
		} catch (err) {
			alert("Error creating city");
		} finally {
			setLoading(false);
		}
	}

	async function deleteCity(id: string) {
		try {
			setLoading(true);
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			});

			setCities((cities) => cities.filter((city) => city.id !== id));
		} catch (err) {
			alert("Error deleteing city");
		} finally {
			setLoading(false);
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				createCity,
				deleteCity,
			}}
		>
			{children}
		</CitiesContext.Provider>
	);
}

function useCities() {
	const context = useContext(CitiesContext);
	if (context === undefined)
		throw new Error("CitiesContext wase used outside the CitiesProvider");
	return context;
}

export { CitiesProvider, useCities };
