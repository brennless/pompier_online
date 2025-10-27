const socket = new WebSocket('ws://'+window.location.hostname+':3000');
socket.addEventListener('open', event => {
		console.log('WebSocket connection established!');
		socket.send(window.location.pathname);
});

function more_than_max(data, dataM, obj) {
		if(dataM != "" && data != ""){
				if(parseInt(data) >= parseInt(dataM)){
						document.querySelector(obj).style.backgroundColor = "var(--danger-color)";
				} else {
						document.querySelector(obj).style.backgroundColor = "var(--default-color)";
				}
		}else{document.querySelector(obj).style.backgroundColor = "var(--default-color)";}

}

console.log(window.location.pathname);
if(window.location.pathname === "/admin"){

const form = document.getElementById("form");
form.addEventListener('submit', (event) => {
		event.preventDefault(); // pas de reload
		const poulsV = document.getElementById('pouls_entry').value;
		const spo2V = document.getElementById('spo2_entry').value;
		const tempV = document.getElementById('temp_entry').value;
		const pniV1 = document.getElementById('pni_entry1').value;
		const pniV2 = document.getElementById('pni_entry2').value;
		const poulsMaxV = document.getElementById('max_pouls').value;
		const spo2MaxV = document.getElementById('max_spo2').value;
		const tempMaxV = document.getElementById('max_temp').value;
		const pniMaxV1 = document.getElementById('max_pni1').value;
		// const pniMaxV2 = document.getElementById('pni_entry2').value;
		const data = {
				pouls : poulsV,
				poulsM : poulsMaxV,
				spo2 : spo2V,
				spo2M : spo2MaxV,
				temp : tempV,
				tempM : tempMaxV,
				pni1 : pniV1,
				pni2 : pniV2,
				pni1M : pniMaxV1,
				//pni2M : pniMaxV2
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
				const pni1 = document.querySelector('.pni > .contenu > .v1');
				const pni2 = document.querySelector('.pni > .contenu > .v2');
				pouls.innerHTML = data.pouls;
				spo2.innerHTML = data.spo2;
				temp.innerHTML = data.temp;
				pni1.innerHTML = data.pni1;
				pni2.innerHTML = data.pni2;

				more_than_max(data.pouls, data.poulsM, '.pouls');
				more_than_max(data.spo2, data.spo2M, '.spo2');
				more_than_max(data.temp, data.tempM, '.temp');
				more_than_max(data.pni1, data.pni1M, '.pni');
		} catch (error) {
				console.log('Oops : ', error);
				console.log('Message : ', event.data.toString());
		}
});

}
