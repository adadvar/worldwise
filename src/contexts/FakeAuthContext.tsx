import React, { createContext, useContext, useReducer } from "react";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => void;
	logout: () => void;
}

const defaultContextValue: AuthContextType = {
	user: null,
	isAuthenticated: false,
	login: () => {},
	logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface User {
	name: string;
	email: string;
	password: string;
	avatar: string;
}

interface InitialState {
	user: User | null;
	isAuthenticated: boolean;
}

const initialState: InitialState = {
	user: null,
	isAuthenticated: false,
};

type Action = { type: "login"; payload: User } | { type: "logout" };

function reducer(state: InitialState, action: Action): InitialState {
	switch (action.type) {
		case "login":
			return { ...state, user: action.payload, isAuthenticated: true };

		case "logout":
			return { ...state, user: null, isAuthenticated: false };
		default:
			return state;
	}
}

const FAKE_USER = {
	name: "Jack",
	email: "jack@example.com",
	password: "qwerty",
	avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }: { children: React.ReactNode }) {
	const [{ user, isAuthenticated }, dispatch] = useReducer(
		reducer,
		initialState
	);

	function login(email: string, password: string) {
		if (email === FAKE_USER.email && password === FAKE_USER.password)
			dispatch({ type: "login", payload: FAKE_USER });
	}
	function logout() {
		dispatch({ type: "logout" });
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined)
		throw new Error("AuthContext was used outside AuthProvider");

	return context;
}

export { AuthProvider, useAuth };
