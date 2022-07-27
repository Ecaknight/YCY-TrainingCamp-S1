const images = [
	'btn.png',
	'btn_circle.png',
	'brake_bike.png',
	'brake_handlerbar.png',
	'brake_lever.png'
]

class BrakeBanner{
	constructor(selector){
		// 创建实例
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff,
			resizeTo: window
		})

		// 挂载到dom上
		document.querySelector(selector).appendChild(this.app.view)

		this.stage = new PIXI.Container() // 容器
		this.app.stage.addChild(this.stage) // 将新增容器添加到根容器上

		this.loader = this.addLoader()
	}

	addLoader() {
		// 资源加载器
		const loader = new PIXI.Loader()
		// 资源入队
		images.forEach(img => {
			loader.add(img, `images/${img}`)
		})
		// 资源加载
		loader.load()
		// 加载完成后回调
		loader.onComplete.add(() => {
			this.show()
		})

		return loader
	}

	show() {
		// 加载按钮图片并设置中心点
		const imgContainer = this.createActionButton()
		imgContainer.x = imgContainer.y = 400

		const bikeContainer = new PIXI.Container()
		this.stage.addChild(bikeContainer)

		bikeContainer.scale.x = bikeContainer.scale.y = 0.3

		const leverImage = new PIXI.Sprite(this.loader.resources['brake_lever.png'].texture)
		bikeContainer.addChild(leverImage)
		leverImage.pivot.x = leverImage.pivot.y = 455
		leverImage.x = 722
		leverImage.y = 900

		const bikeImage = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture)
		bikeContainer.addChild(bikeImage)

		const handlerImage = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture)
		bikeContainer.addChild(handlerImage)

		this.stage.addChild(imgContainer)
		imgContainer.interactive = true
		imgContainer.buttonMode = true

		imgContainer.on('mousedown', () => {
			gsap.to(leverImage, {
				duration: .6,
				rotation: Math.PI/180*-30,
			})
			pause()
		})
		imgContainer.on('mouseup', () => {
			gsap.to(leverImage, {
				duration: .6,
				rotation: 0,
			})
			start()
		})

		let resize = () => {
			bikeContainer.x = window.innerWidth - bikeContainer.width
			bikeContainer.y = window.innerHeight - bikeContainer.height
			imgContainer.x = window.innerWidth - imgContainer.width
			imgContainer.y = window.innerHeight - imgContainer.height
		}
		window.addEventListener('resize', resize)
		resize()

		// 创建粒子
		let particleZoneSize = window.innerWidth
		let particleContainer = new PIXI.Container()
		this.stage.addChild(particleContainer)

		let particles = []
		const colors = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0x818181, 0x000000];
		for (let i = 0; i < 10; i++) {
			let gr = new PIXI.Graphics()
			gr.beginFill(colors[Math.floor(Math.random() * colors.length)])
			gr.drawCircle(0,0,6)
			gr.endFill()
			let parItem = {
				sx: Math.random() * particleZoneSize,
				sy: Math.random() * window.innerHeight,
				gr
			}
			gr.x = parItem.sx
			gr.y = parItem.sy
			particleContainer.addChild(gr)
			particles.push(parItem)
		}

		let zWidth = particleZoneSize/2
		let zHeight = window.innerHeight / 2
		particleContainer.pivot.set(zWidth,zWidth)
		particleContainer.rotation = (35 * Math.PI) / 180
		particleContainer.x = zWidth
		particleContainer.y = zHeight

		let speed = 0
		function loop() {
			speed += .5
			speed = Math.min(speed, 20)
			for (let i = 0; i < particles.length; i++) {
				let pItem = particles[i]
				let gr = pItem.gr
				gr.y += speed

				if (speed >= 20) {
					gr.scale.y = 40
					gr.scale.x = .03
				}
				if (gr.y > window.innerHeight) {
					gr.y = 0
				}
			}
		}

		function start() {
			speed = 0
			gsap.ticker.add(loop)
		}

		function pause() {
			gsap.ticker.remove(loop)
			for (let i = 0; i < particles.length; i++) {
				let pItem = particles[i]
				let gr = pItem.gr

				gr.scale.y = 1
				gr.scale.x = 1
				gsap.to(gr, {
					duration: .6,
					x: pItem.sx,
					y: pItem.sy,
					ease: 'elastic.out'
				})
			}
		}

		start()
	}

	createActionButton() {
		// 加载按钮容器
		const imgContainer = new PIXI.Container()
		// 将按钮图片纹理加入到容器中
		let btnImg = new PIXI.Sprite(this.loader.resources['btn.png'].texture)
		imgContainer.addChild(btnImg)

		let btnCircle = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture)
		imgContainer.addChild(btnCircle)

		let btnCircle2 = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture)
		imgContainer.addChild(btnCircle2)

		// 设置中心点
		btnImg.pivot.x = btnImg.pivot.y = btnImg.width / 2
		btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2
		btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width / 2

		// 动画
		btnCircle.scale.x = btnCircle.scale.y = 0.8
		// 引入gsap动画
		gsap.to(btnCircle.scale, {
			duration: 1,
			x: 1.3,
			y: 1.3,
			repeat: -1
		})
		gsap.to(btnCircle, {
			duration: 1,
			alpha: 0,
			repeat: -1
		})
		return imgContainer
	}
}