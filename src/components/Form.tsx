// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import { Button } from "./Button";
import BackButton from "./BackButton";
import useUrlPosition from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode: string) {
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
	const [lat, lng] = useUrlPosition();
	const { createCity, isLoading } = useCities();
	const navigate = useNavigate();

	const [isLoadingGeocoding, setLoadingGeocoding] = useState(false);
	const [cityName, setCityName] = useState("");
	const [country, setCountry] = useState("");
	const [date, setDate] = useState<Date | null>(new Date());
	const [notes, setNotes] = useState("");
	const [emoji, setEmoji] = useState("");
	const [geoCodingError, setGeoCogingError] = useState("");

	useEffect(() => {
		if (!lat && !lng) return;

		async function fetchCityData() {
			try {
				setLoadingGeocoding(true);
				setGeoCogingError("");
				const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
				const data = await res.json();

				if (!data.countryCode) {
					throw new Error("Click somewhere else!");
				}

				setCityName(data.city || data.locality || "");
				setCountry(data.countryName);
				setEmoji(convertToEmoji(data.countryCode));
			} catch (err: unknown) {
				if (err instanceof Error) setGeoCogingError(err.message);
			} finally {
				setLoadingGeocoding(false);
			}
		}
		fetchCityData();
	}, [lat, lng]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!cityName || !date) return;

		const newCity = {
			cityName,
			country,
			emoji,
			date,
			notes,
			position: { lat, lng },
		};
		//@ts-ignore
		await createCity(newCity);

		navigate("/app");
	};

	if (isLoadingGeocoding) return <Spinner />;

	if (!lat && !lng)
		return <Message message="Start by clicking somewhere on the map" />;

	if (geoCodingError) return <Message message={geoCodingError} />;

	return (
		<form
			className={`${styles.form} ${isLoading ? styles.loading : ""}`}
			onSubmit={handleSubmit}
		>
			<div className={styles.row}>
				<label htmlFor="cityName">City name</label>
				<input
					id="cityName"
					onChange={(e) => setCityName(e.target.value)}
					value={cityName}
				/>
				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor="date">When did you go to {cityName}?</label>
				<DatePicker
					id="date"
					onChange={(date) => setDate(date)}
					selected={date}
					dateFormat="dd/MM/yyyy"
				/>
			</div>

			<div className={styles.row}>
				<label htmlFor="notes">Notes about your trip to {cityName}</label>
				<textarea
					id="notes"
					onChange={(e) => setNotes(e.target.value)}
					value={notes}
				/>
			</div>

			<div className={styles.buttons}>
				<Button type="primary" onClick={() => {}}>
					Add
				</Button>
				<BackButton />
			</div>
		</form>
	);
}

export default Form;
