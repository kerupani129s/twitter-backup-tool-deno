export default class Profile {

	#config;

	constructor(path) {

		this.#config = (async () => {
			const text = await Deno.readTextFile(path);
			return JSON.parse(text);
		})();

	}

	async get(name) {

		const config = await this.#config;

		const obj = {};

		obj['api_key']        = config['api_key'];
		obj['api_secret_key'] = config['api_secret_key'];
		obj['access_token']        = config['profiles'][name]['access_token'];
		obj['access_token_secret'] = config['profiles'][name]['access_token_secret'];

		return obj;

	}

}
