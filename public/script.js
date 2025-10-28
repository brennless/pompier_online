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


function update_client(data){
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
}

function update_clients_list(idC, action){
		console.log('Update des clients...');
		if(action === 'rm'){
				document.querySelector('#'+idC).remove();
		} else if(action === 'new'){
				const new_client = document.createElement('li');
				new_client.id = idC;
				new_client.innerHTML = '<input type="checkbox" id="'+idC+'-CB">'+idC+'</input>';
				document.querySelector('#clients_list').appendChild(new_client);
		}
}

function interpret_client(messageJSON){
		console.log('Client message received :', messageJSON);
		if (messageJSON.type === 'form'){
				update_client(messageJSON.data);
		} else if(messageJSON.type === 'id'){
				const idC = document.createElement('div');
				idC.id = "id_client";
				idC.textContent = messageJSON.data;
				document.body.appendChild(idC);

		}
}

function interpret_admin(messageJSON){
		console.log('Admin message received :', messageJSON);
		if(messageJSON.type === 'new_client'){
				update_clients_list(messageJSON.data, 'new');
		} else if(messageJSON.type === 'rm_client'){
				update_clients_list(messageJSON.data, 'rm');
		}
}

function interpret(messageJSON){
		console.log('Interpretation du message :', messageJSON);
		if(messageJSON.pour === 'client'){
				interpret_client(messageJSON);
		} else if(messageJSON.pour === 'admin'){
				interpret_admin(messageJSON);
		}
}

if(window.location.pathname === "/admin"){
// gestion du formulaire
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
		let id_clients = [];

		document.querySelectorAll('#clients_list > li').forEach(li => {
				if(document.querySelector('#'+li.id+'-CB').checked){
						id_clients.push(li.id);
				}
		});

		// const pniMaxV2 = document.getElementById('pni_entry2').value;
		const formData = { 
				pour : "server",
				type : "form",
				data : {
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
						ids : id_clients
						}
		}
		console.log(formData);
		socket.send(JSON.stringify(formData));
});

} else {
		console.log("On est pas sur la page admin");
}

// interpretation de tout message
socket.addEventListener("message", event => {
		try {
				const message = JSON.parse(event.data);
				interpret(message);
				/*
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
				*/
		} catch (error) {
				/*
				if(event.data.toString()[0]==='i'){
						console.log("Création de l'element DOM");
						const idC = document.createElement('div');
						idC.id = "id_client";
						idC.textContent = event.data.toString().slice(1);
						document.body.appendChild(idC);
				}
				*/
				console.error('Oops : ', error, '\nMessage :', event.data.toString());
		}
});

socket.addEventListener('close', event => {
		console.log('Connection interrompue');
		const alerte = document.createElement('div');
		alerte.id = 'alerte';
		alerte.textContent = "La page n'est plus connectée, rafraichir la page";
		document.body.appendChild(alerte);
});
