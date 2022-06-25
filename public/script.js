const enterButton = document.getElementById("enter-button");
const ingredient = document.getElementById("ingredient-name").value;

enterButton.addEventListener("click", () => {
	const name = document.getElementById("ingredient-name").value;
	console.log(name);
	axios.post("/ingredients", {
		name: `${name}`,
	});
});
