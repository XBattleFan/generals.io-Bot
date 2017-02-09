const TILE = require('./tile.js'); 
const patch = require('./updatePatcher.js');

class GameState {

	constructor(data, playerIndex) {
		this.cities = [];
		this.map = [];

		this.playerIndex = playerIndex;
		this.ownTiles = new Map();
		this.enemyTiles = new Map();

		this.update(data);
	}

	update(data) {
		// Patch the city and map diffs into our local variables.
		this.cities = patch(this.cities, data.cities_diff);
		this.map = patch(this.map, data.map_diff);
		this.generals = data.generals;

		this.turn = data.turn;
	
		// The first two terms in |map| are the dimensions.
		this.width = this.map[0];
		this.height = this.map[1];
		this.size = this.width * this.height;

		// The next |size| terms are army values.
		// armies[0] is the top-left corner of the map.
		this.armies = this.map.slice(2, this.size + 1);

		// The last |size| terms are terrain values.
		// terrain[0] is the top-left corner of the map.
		this.terrain = this.map.slice(this.size + 2, this.map.length - 1);
		this.updatePlayerTiles();
	}

	updatePlayerTiles() {
		this.ownTiles.clear();
		this.enemyTiles.clear();
		for(let i = 0; i < this.terrain.length; i++) {
			let tile = this.terrain[i];
			if(tile >= 0) {
				let armies = this.armies[i];
				if(tile == this.playerIndex) {
					this.ownTiles.set(i, armies);
				} else {
					this.enemyTiles.set(i, armies);
				}
			}
		}
	}
}

module.exports = GameState;