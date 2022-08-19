export function calculateChanges(cents: number) {
	let amount = cents;

	const houndreds = Math.round(amount / 100);
	amount = amount % 100;
	const fifties = Math.round(amount / 50);
	amount = amount % 50;
	const twenties = Math.round(amount / 20);
	amount = amount % 20;
	const tens = Math.round(amount / 10);
	amount = amount % 10;
	const fives = Math.round(amount / 5);
	amount = amount % 5;

	return {
		100: houndreds,
		50: fifties,
		20: twenties,
		10: tens,
		5: fives,
	};
}
