import kaboom from "kaboom"

const k = kaboom({
	background: [0, 0, 0]
})

k.loadSprite("player", "sprites/shooter.png");
k.loadSprite("bullet", 'sprites/bullet3.png');
k.loadSprite('zumbi', 'sprites/zumbi.png');
k.loadSprite('block', 'sprites/block.png');

k.loadSprite("green", "sprites/green.jpg");
k.loadSprite("piso", "sprites/piso.png");

k.loadSound("shoot", "music/Pistola22cal.mp3");
k.loadSound("dead", "music/morte.mp3");
k.loadSound("hit", "music/Kick3.mp3");


k.setGravity(1)

const player = k.add([
	k.pos(k.center()),
	k.sprite("player"),
	k.scale(0.5),
	k.rotate(0),
	k.anchor('center'),
	k.health(10),
	k.area(),
	'player',
	'friendly',
	k.z(1),
]);

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let multiply = 1;

function spawnEnemy() {
	const x = getRandomInt(0, window.innerWidth);
	const y = getRandomInt(0, window.innerHeight);
	
	const enemy = k.add([
		k.pos(x, y),
		k.sprite("zumbi"),
		k.scale(0.5),
		rotate(0),
		k.anchor('center'),
		k.health(200),
		k.move(0, 0),
		k.area(),
		k.body(),
		"zumbi",
		"attack",
		k.z(1),
	]);
	
	enemy.on("death", () => {
		enemy.destroy();
		multiply++;
		k.play("dead", {
			volume: 0.05,
		});

		
	});
	k.onUpdate(() => {
		const direction = player.pos.sub(enemy.pos);
		
		const speed = 2;
		
		const mouseX =  player.pos.x - enemy.pos.x;
		const mouseY =  player.pos.y - enemy.pos.y;
		
		const radio = Math.atan2(mouseY, mouseX)
		
		const angle = radio * 180 / Math.PI
		
		enemy.pos = enemy.pos.add(direction.unit().scale(speed));
		
		enemy.rotateTo(angle)
	});
	
}

spawnEnemy();
setInterval(() => {
	spawnEnemy();
	spawnEnemy();
}, 3000)



const speed = 3;

k.onKeyDown('d', () => {
	player.pos.x += speed;
});

k.onKeyDown('a', () => {
	player.pos.x -= speed;
});

k.onKeyDown('s', () => {
	player.pos.y += speed;
});

k.onKeyDown('w', () => {
	player.pos.y -= speed;
	
});

function getXYFromDegrees(angle, radius) {
	if (typeof angle === 'radians') {
		angle = angle * 180 / Math.PI;
	}
	
	const x = radius * Math.cos(angle * Math.PI / 180);
	const y = radius * Math.sin(angle * Math.PI / 180);
	
	return { x, y };
}

let fire = false;

let cadencia = 10


const button = document.getElementById("set-candencia");

button.addEventListener("click", () => {
	const inputCandencia = document.getElementById("candencia-input");

	if (!Number(inputCandencia.value)) {
		return;
	}
	
	cadencia = Number(inputCandencia.value);
});

k.onMouseDown((m) => {
	if (fire) {
		return;
	}
	k.play("shoot", {
		volume: 0.5,
	});
	const mousePosition = k.mousePos();
	
	const mouseX = mousePosition.x - (player.pos.x);
	const mouseY = mousePosition.y - (player.pos.y);
	
	
	const radio = Math.atan2(mouseY, mouseX)
	
	const angle = radio * 180 / Math.PI
	
	const raio = 80;
	
	const xy = getXYFromDegrees(angle, raio)
	
	const bullet = k.add([
		k.pos(xy.x + player.pos.x, xy.y + player.pos.y),
		k.sprite("bullet"),
		k.anchor('center'),
		k.move(k.mousePos().sub(player.pos), 2500),
		k.scale(0.01),
		k.rotate(angle),
		k.area(),
		k.z(1),
	]);

	bullet.onCollide("zumbi", (enemy) => {
		enemy.hurt(50);
		k.play("hit", {
			volume: 0.02,
		})
	})

	fire = true


	setTimeout(() => {
		fire = false;
	}, 1000 / cadencia);

	setTimeout(() => {
		bullet.destroy();
	}, 5000);
})

k.onCollide("bullet", "=", (a, b, col) => {
	console.log(a, b, col)
})

k.onMouseMove(() => {
	const mousePosition = k.mousePos();

	const mouseX = mousePosition.x - player.pos.x;
	const mouseY = mousePosition.y - player.pos.y;


	const radio = Math.atan2(mouseY, mouseX)

	const angle = radio * 180 / Math.PI

	player.rotateTo(angle);
})

k.addLevel([
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
	"                                                          ",
], {
	tileHeight: 55,
	tileWidth: 55,
	tiles: {
		"": () => [
			k.sprite('block'),
			k.area(),
			k.scale(0.6),
		],
		"": () => [
			k.anchor("center"),
			k.sprite('piso'),
			k.scale(0.4),
			k.z(0)
		]

	},
});


