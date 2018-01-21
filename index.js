// grabbing our elements from the form
const form = document.querySelector('form');
const apiKeyInput = document.querySelector('#apiKeyInput');
const memeUrlInput = document.querySelector('#memeUrlInput');
const resultPara = document.querySelector('#resultPara');
const resultImage = document.querySelector('#resultImage');

// getting party started!
const onSubmit = (event) => {
	event.preventDefault();
	console.log('this form was submitted!', event);
	const memeUrl = memeUrlInput.value;
	const apiKey = apiKeyInput.value || localStorage.getItem('apiKey');
	localStorage.setItem('apiKey', apiKey);
	
	getOcrResult(memeUrl, apiKey)
		.then((response) => console.log(response))
		.catch(console.error);
};

// getting raw result from the API
const getOcrResult = (memeUrl, apiKey) => {
	const apiUrl = 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0';
	const params = {
		'language': 'unk',
		'detectOrientation': 'true',	
	};
	const paramsString = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
	const encodedUrl = `${apiUrl}?${encodeURI(paramsString)}`;

	const headers = new Headers({
		'Content-Type': 'application/json',
		'Ocp-Apim-Subscription-Key': apiKey	
	});

	const fetchOptions = {
		method: 'POST',
		header: headers,
		body: `{"url": "${memeUrl}"}`	
	};

	return	fetch(encodedUrl, fetchOptions)
		.then((response) => response.json())
};

// formatting the result
const formatResult = () => {
	
};

form.addEventListener('submit', onSubmit);