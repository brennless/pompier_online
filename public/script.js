const socket = new WebSocket('ws://mir.ovh:3000');
socket.addEventListener('open', event => {
  console.log('WebSocket connection established!');
  // Sends a message to the WebSocket server
		if(window.location.pathname == "/admin"){ socket.send("admin") }
		else { socket.send("client") }
});

console.log(window.location.pathname);
if(window.location.pathname === "/admin"){
		const btn_admin = document.getElementById("btn_admin");
		btn_admin.addEventListener("click", () => {
				socket.send("L'ADMIN A CLIQUE")
		})
}
else{
		console.log("On est pas sur la page admin");

socket.addEventListener("message", event => {
		const titre = document.getElementById("Titre");
		console.log(event.data)
		if(event.data.toString() == "change vite"){
				titre.style.color = "red";
				console.log("l'admin a bien cliqué");
		}
})
}
