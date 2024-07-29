import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
} from "react";
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
	error: string;
	getCity: (id: string) => void;
	createCity: (newCity: City) => void;
	deleteCity: (id: string) => void;
}
const defaultContextValue: CitiesContextType = {
	cities: [],
	isLoading: false,
	currentCity: null,
	error: "",
	getCity: async () => {},
	createCity: async () => {},
	deleteCity: async () => {},
};

const CitiesContext = createContext<CitiesContextType>(defaultContextValue);
const BASE_URL = "http://localhost:8000";

interface InitialState {
	cities: City[];
	isLoading: boolean;
	currentCity: City | null;
	error: string;
}

const initialState: InitialState = {
	cities: [],
	isLoading: false,
	currentCity: null,
	error: "",
};

type Action =
	| { type: "loading" }
	| { type: "cities/loaded"; payload: City[] }
	| { type: "city/loaded"; payload: City }
	| { type: "city/created"; payload: City }
	| { type: "city/deleted"; payload: string }
	| { type: "rejected"; payload: string };

function reducer(state: InitialState, action: Action): InitialState {
	switch (action.type) {
		case "loading":
			return { ...state, isLoading: true };
		case "cities/loaded":
			return { ...state, isLoading: false, cities: action.payload };

		case "city/loaded":
			return { ...state, isLoading: false, currentCity: action.payload };

		case "city/created":
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};

		case "city/deleted":
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter((city) => city.id !== action.payload),
				currentCity: null,
			};

		case "rejected":
			return { ...state, isLoading: false, error: action.payload };

		default:
			return state;
	}
}

function CitiesProvider({ children }: { children: React.ReactNode }) {
	const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
		reducer,
		initialState
	);

	useEffect(() => {
		const fetchCities = async () => {
			dispatch({ type: "loading" });
			try {
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				dispatch({ type: "cities/loaded", payload: data });
			} catch (err) {
				dispatch({ type: "rejected", payload: "Error fetching cities" });
			}
		};
		fetchCities();
	}, []);

	const getCity = useCallback(
		async function getCity(id: string) {
			if (Number(id) === Number(currentCity?.id)) return;
			dispatch({ type: "loading" });
			try {
				const res = await fetch(`${BASE_URL}/cities/${id}`);
				const data = await res.json();
				dispatch({ type: "city/loaded", payload: data });
			} catch (err) {
				dispatch({ type: "rejected", payload: "Error fetching city" });
			}
		},
		[currentCity?.id]
	);

	async function createCity(newCity: City) {
		try {
			const res = await fetch(`${BASE_URL}/cities/`, {
				method: "POST",
				body: JSON.stringify(newCity),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			dispatch({ type: "city/created", payload: data });
		} catch (err) {
			dispatch({ type: "rejected", payload: "Error creating city" });
		}
	}

	async function deleteCity(id: string) {
		try {
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			});

			dispatch({ type: "city/deleted", payload: id });
		} catch (err) {
			dispatch({ type: "rejected", payload: "Error deleting city" });
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				error,
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
