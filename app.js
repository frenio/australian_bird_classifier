import { client } from "@gradio/client";

const response_0 = await fetch("https://frenio-australian-bird-classifier.hf.space/file=/home/user/app/red_crimson_rosella.jpg");
const exampleImage = await response_0.blob();
						
const app = await client("https://frenio-australian-bird-classifier.hf.space/");
const result = await app.predict("/predict", [
				exampleImage, 	// blob in 'img' Image component
	]);

console.log(result.data);

