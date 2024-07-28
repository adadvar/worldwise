import styles from "./Button.module.css";

interface Props {
	children: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	type: "primary" | "back" | "position";
}

export const Button = ({ children, onClick, type }: Props) => {
	return (
		<button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
			{children}
		</button>
	);
};
