import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export default function Login() {
	// PRE-FILL FOR DEV PURPOSES
	const [email, setEmail] = useState("jack@example.com");
	const [password, setPassword] = useState("qwerty");

	const { login, isAuthenticated } = useAuth();

	const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
		e.preventDefault();
		if (email && password) login(email, password);
	};

	const navigate = useNavigate();
	useEffect(() => {
		if (isAuthenticated) navigate("/app", { replace: true });
	}, [isAuthenticated]);

	return (
		<main className={styles.login} onSubmit={handleSubmit}>
			<PageNav />
			<form className={styles.form}>
				<div className={styles.row}>
					<label htmlFor="email">Email address</label>
					<input
						type="email"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>

				<div className={styles.row}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
				</div>

				<div>
					<Button type="primary">Loging</Button>
				</div>
			</form>
		</main>
	);
}
