const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const btnStandard = document.getElementById('standard')
const btnEndless = document.getElementById('endless')
const btnWarning = document.getElementById('warning')
const LAST_LEVEL = 10
const LOG_CHEAT_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13]
var code = []

class Juego {
	constructor(endless) {
		this.endless = endless
		this.inicializar = this.inicializar.bind(this)
		this.inicializar()
		this.generateSequence(endless)
		this.nextLevel()
		this.logToConsole = false
	}
	inicializar() {
		btnEmpezar.classList.toggle('hide')
		btnStandard.classList.toggle('hide')
		btnEndless.classList.toggle('hide')
		this.chooseColor = this.chooseColor.bind(this)
		this.nextLevel = this.nextLevel.bind(this)
		this.level = 1
		this.colors = {
			celeste,
			violeta,
			naranja,
			verde
		}
	}
	generateSequence() {
		if (this.endless){
			this.sequence = new Array(1).fill(0).map(n => Math.floor(Math.random() * 4))
		} else {
			this.sequence = new Array(LAST_LEVEL).fill(0).map(n => Math.floor(Math.random() * 4))
		}
	}
	nextLevel() {
		console.clear()
		this.subLevel = 0
		setTimeout(() => {
			this.lightSequence()
			this.addClickEvents()
			if (this.logToConsole){
				for (let i = 0; i < this.level; i++){
					console.log(this.numberToColor(this.sequence[i]))
				}
			}
		}, 400)
	}
	lightSequence() {
		for (let i = 0; i < this.level; i++){
			const color = this.numberToColor(this.sequence[i])
			setTimeout(() => this.lightColor(color), 700 * i)
		}
	}
	numberToColor(num) {
		switch (num) {
			case 0:
			return 'celeste'
			case 1:
			return 'violeta'
			case 2:
			return 'naranja'
			case 3:
			return 'verde'
		}
	}
	lightColor(c){
		this.colors[c].classList.add('light')
		setTimeout(() => this.darkenColor(c), 300)
	}
	darkenColor(c){
		this.colors[c].classList.remove('light')
	}
	addClickEvents() {
		this.colors.celeste.addEventListener('click', this.chooseColor)
		this.colors.violeta.addEventListener('click', this.chooseColor)
		this.colors.naranja.addEventListener('click', this.chooseColor)
		this.colors.verde.addEventListener('click', this.chooseColor)
	}
	removeClickEvents() {
		this.colors.celeste.removeEventListener('click', this.chooseColor)
		this.colors.violeta.removeEventListener('click', this.chooseColor)
		this.colors.naranja.removeEventListener('click', this.chooseColor)
		this.colors.verde.removeEventListener('click', this.chooseColor)
	}
	chooseColor(ev) {
		const colorName = ev.target.dataset.color
		const colorNumber = this.colorToNumber(colorName)
		this.lightColor(colorName)
		if (!this.endless) {
			if (colorNumber === this.sequence[this.subLevel]){
				this.subLevel++
				if(this.subLevel === this.level) {
					this.level++
					this.removeClickEvents()
					if(this.level === (LAST_LEVEL + 1)){
						this.gameWin(LAST_LEVEL)
					} else {
						setTimeout(this.nextLevel, 1200)
					}
				}
			} else {
				this.gameLoss(this.level)
			}
		} 	else if (colorNumber === this.sequence[this.subLevel]){
						this.subLevel++
						if(this.subLevel === this.level) {
							this.level++
							this.addLevel()
							this.removeClickEvents()
							setTimeout(this.nextLevel, 1200)
						}
					} 	else {
				this.gameEnd(this.level)
			}
	}
	colorToNumber(col){
		switch (col) {
			case 'celeste':
			return 0
			case 'violeta':
			return 1
			case 'naranja':
			return 2
			case 'verde':
			return 3
		}
	}
	gameWin(lv){
		swal(`Ganaste!`, `Llegaste al nivel ${lv}`, 'success')
		.then(() => {
			this.inicializar()
		})
	}
	gameLoss(lv){
		swal(`Perdiste`, `Llegaste al nivel ${lv}...`, 'error')
		.then(() => {
			this.removeClickEvents()
			this.inicializar()
		})
	}
	addLevel(){
		this.sequence.push(Math.floor(Math.random()*4))
	}
	gameEnd(lv){
		swal('Felicidades', `Llegaste al nivel ${lv}`, 'success')
		.then(() => {
			this.removeClickEvents()
			this.inicializar()
		})
	}
	lightAll(){
		for(let i = 0; i<3; i++){
			setTimeout(() => {
				this.lightColor(this.numberToColor(0))
				this.lightColor(this.numberToColor(1))
				this.lightColor(this.numberToColor(2))
				this.lightColor(this.numberToColor(3))
			}, i*400)
		}
		setTimeout(() => {
			this.removeClickEvents()
			this.nextLevel()
			btnWarning.classList.toggle('hide')
		}, 1400)
	}
}

function empezarJuego(bl) {
	window.juego = new Juego(bl)
	window.addEventListener('keyup', logCheatcode)
}

function logCheatcode(ev){
	code.push(ev.keyCode)
	if (code.length===11){
		confirmCheats()
	}
	if(code.length>11){
		code.splice(0, code.length)
	}
}

function confirmCheats(){
	if (code.every(checkCheat)){
		window.removeEventListener('keyup', logCheatcode)
		window.juego.logToConsole = true
		window.juego.lightAll()
		btnWarning.classList.toggle('hide')
	} else {
		code.splice(0, code.length)
	}
}

function checkCheat(n, i){
	return n === LOG_CHEAT_CODE[i]
}

