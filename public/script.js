const socket = new WebSocket('ws://192.168.1.135:3000');
socket.addEventListener('open', event => {
		console.log('WebSocket connection established!');
		socket.send(window.location.pathname);
});

console.log(window.location.pathname);
if(window.location.pathname === "/admin"){

const form = document.getElementById("form");
form.addEventListener('submit', (event) => {
		event.preventDefault(); // pas de reload
		const poulsV = document.getElementById('pouls_entry').value;
		const spo2V = document.getElementById('spo2_entry').value;
		const tempV = document.getElementById('temp_entry').value;
		const pniV = document.getElementById('pni_entry').value;
		const data = {
				pouls : poulsV,
				spo2 : spo2V,
				temp : tempV,
				pni : pniV
		}
		console.log(data);
		socket.send(JSON.stringify(data));
});

}else{

console.log("On est pas sur la page admin");

socket.addEventListener("message", event => {
		try {
				const data = JSON.parse(event.data);
				console.log('Received JSON:', data);
				const acc = ' > .contenu > p';
				const pouls = document.querySelector('.pouls'+acc);
				const spo2 = document.querySelector('.spo2'+acc);
				const temp = document.querySelector('.temp'+acc);
				const pni = document.querySelector('.pni'+acc);
				pouls.innerHTML = data.pouls;
				spo2.innerHTML = data.spo2;
				temp.innerHTML = data.temp;
				pni.innerHTML = data.pni;
		} catch (error) {
				console.error('Oops : ', error);
				console.log('Message : ', event.data.toString());
		}
});

}
