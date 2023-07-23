document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('imageUpload').addEventListener('change', async function() {
		let reader = new FileReader();
		reader.onloadend = function() {
		const base64data = reader.result;
		predict(base64data);
		}

		reader.onerror = function (error) {
		document.getElementById('results').innerHTML = `Image load error: ${error}`;
		};

		// This will convert the uploaded image file to base64
		reader.readAsDataURL(this.files[0]);
    });

	fetchImageAndPredict('example_images/rainbow_lorikeets.jpg');

	document.getElementById('example1').addEventListener('click', function() {
	  fetchImageAndPredict('example_images/rainbow_lorikeets.jpg');
	});	    

	document.getElementById('example2').addEventListener('click', function() {
	  fetchImageAndPredict('example_images/red_crimson_rosella.jpg');
	});

	document.getElementById('example3').addEventListener('click', function() {
	  fetchImageAndPredict('example_imgaes/flying_galah.jpg');
	});	    

});

async function fetchImageAndPredict(imageSrc) {
	const response = await fetch(imageSrc);
	const blob = await response.blob();
	let reader = new FileReader();
	reader.onloadend = function() {
		const base64data = reader.result;
		predict(base64data);
	};
	reader.readAsDataURL(blob);
}

async function predict(base64data) {

	try {

		const response = await fetch('https://frenio-australian-bird-classifier.hf.space/run/predict', {
			method: "POST",
			body: JSON.stringify({ "data": [base64data] }),
			headers: { "Content-Type": "application/json" }
		});

		const json = await response.json();

		let label1 = json['data'][0]['confidences'][0]['label'].replace(/_/g, " ");
		label1 = label1.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		const confidence1 = (Math.round(json['data'][0]['confidences'][0]['confidence'] * 100) / 100).toFixed(2);
		
		let label2 = json['data'][0]['confidences'][1]['label'].replace(/_/g, " ");
		label2 = label2.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		const confidence2 = (Math.round(json['data'][0]['confidences'][1]['confidence'] * 100) / 100).toFixed(2);
		
		let label3 = json['data'][0]['confidences'][2]['label'].replace(/_/g, " ");
		label3 = label3.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		const confidence3 = (Math.round(json['data'][0]['confidences'][2]['confidence'] * 100) / 100).toFixed(2);
		
		document.getElementById('results').innerHTML =`
                    <br/>
                    <div class='results'>
				    	<img src="${base64data}" width="300">
				    </div>
				    <table class='results'>
				        <tr>
				            <th class='label-cell'>Label</th>
				            <th class='label-cell'>Confidence</th>
				        </tr>
				        <tr>
				            <td>${label1}</td>
				            <td class="confidence-cell">${confidence1}</td>
				        </tr>
				        <tr>
				            <td>${label2}</td>
				            <td class="confidence-cell">${confidence2}</td>
				        </tr>
				        <tr>
				            <td>${label3}</td>
				            <td class="confidence-cell">${confidence3}</td>
				        </tr>
				    </table>
				`;

	} catch (error) {

  		document.getElementById('results').innerHTML = `API error: ${error}`;
  		
	}
}
