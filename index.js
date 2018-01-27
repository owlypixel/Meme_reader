// grabbing our elements from the page
const form = document.querySelector('form');
const apiKeyInput = document.querySelector('#apiKeyInput');
const memeUrlInput = document.querySelector('#memeUrlInput');
const resultPara = document.querySelector('#resultPara');
const resultImage = document.querySelector('#resultImage');
const wrapper = document.querySelector('.box-wrapper');
const back = document.querySelector('#back');

// getting party started!
const onSubmit = (event) => {
	event.preventDefault();
	const memeUrl = memeUrlInput.value;
	const apiKey = apiKeyInput.value || localStorage.getItem('apiKey');
	localStorage.setItem('apiKey', apiKey);
	resultImage.src = memeUrl;

	getOcrResult(memeUrl, apiKey)
		.then(formatResponse)
		.then((memeText) => resultPara.textContent = memeText.toUpperCase())
		.catch(console.error);
	wrapper.classList.add('flip');
};

// getting raw result from the API
const getOcrResult = (memeUrl, apiKey) => {
	const apiUrl = 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr';
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
		headers,
		body: `{"url": "${memeUrl}"}`	
	};

	return	fetch(encodedUrl, fetchOptions)
		.then((response) => response.json())
};

// formatting the response
const formatResponse = (response) => {
	return new Promise((resolve, reject) => {
		const flatResponse = response.regions.map((region) => {
			return region.lines.map((line) => {
				return line.words.reduce((wordstring, word) => {
					return `${wordstring} ${word.text}`;			
				}, '');	
			}).join('');
		}).join('');
		resolve(flatResponse);
	});
};

const returnBack = (event) => {
	wrapper.classList.remove('flip');
}

// attaching event listeners
form.addEventListener('submit', onSubmit);
back.addEventListener('click', returnBack);