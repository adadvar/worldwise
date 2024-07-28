import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (!isAuthenticated) navigate("/");
	}, [isAuthenticated, navigate]);

	return isAuthenticated ? children : null;
};

export default ProtectedRoute;
