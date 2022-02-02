class Scene02 extends Phaser.Scene{
	constructor(){
		super('Scene02')
	}
	
	init(data){
		this.score = data.score
	}
	
	create(){
		this.sndMusic = this.sound.add('sndMusic')
		this.sndMusic.play({
			volume: .5,
			loop: true
		})
		this.sndJump = this.sound.add('sndJump')
		this.sndGetCoin = this.sound.add('sndGetCoin')
	
		this.sky = this.add.image(0,0,'sky').setOrigin(0)
		this.sky.displayWidth = 1000
		this.sky.displayHeight = 600
		this.sky.alpha = .5
		
		this.player = this.physics.add.sprite(50,500,'player')
		.setCollideWorldBounds(true)
		.setScale(2)
		.setBounce(.4)
		this.player.canJump = true
		this.player.body.setSize(16,32)
		
		
		this.control = this.input.keyboard.createCursorKeys()
		
		this.platforms = this.physics.add.staticGroup()
		this.platforms.create(0,600,'platform')
		.setScale(2.5,1)
		.setOrigin(0,1)
		.refreshBody()
		this.platforms.create(200,200,'platform')
		this.platforms.create(1100,200,'platform')
		this.platforms.create(1090,475,'platform')
		this.platforms.create(600,400,'platform')
		.setScale(.75,1)
		.refreshBody()
		
		this.mPlatforms = this.physics.add.group({
			allowGravity: false,
			immovable: true
		})
		
		let mPlatform = this.mPlatforms.create(150,475,'platform').setScale(.25,1)
			mPlatform.speed = 2
			mPlatform.minX = 150
			mPlatform.maxX = 300
			
			mPlatform = this.mPlatforms.create(500,280,'platform').setScale(.25,1)
			mPlatform.speed = 1
			mPlatform.minX = 500
			mPlatform.maxX = 800
			
		this.coins = this.physics.add.group({
			key: 'coin',
			repeat: 14,
			setXY: {
				x: 12,
				y: -50,
				stepX: 70
			}
		})
		
		this.coins.children.iterate((c) => {
			c.setBounceY(Phaser.Math.FloatBetween(.4,.8))
			c.anims.play('spin')
		})
		
		//this.score = 0
		this.txtScore = this.add.text(15,15,`SCORE: ${this.score}`,{fontSize: '32px'})
		.setShadow(0,0,'#000',3)
		.setScrollFactor(0)
		this.setScore()
		
		this.enemies = this.physics.add.group()
		let enemy = this.enemies.create(Phaser.Math.Between(50,950),0,'enemy')
		.setBounce(1)
		.setCollideWorldBounds(true)
		.setVelocity(Math.random() < .5 ? -200 : 200, 50)
		
		enemy = this.enemies.create(Phaser.Math.Between(50,950),0,'enemy')
		.setBounce(1)
		.setCollideWorldBounds(true)
		.setVelocity(Math.random() < .5 ? -200 : 200, 50)
		
		this.physics.add.collider(this.player, this.mPlatforms, this.platformMovingThings)
		this.physics.add.collider(this.player, this.enemies, this.enemyHit, null, this)
		this.physics.add.collider(this.coins, this.mPlatforms, this.platformMovingThings)
		this.physics.add.collider(this.player, this.platforms)
		this.physics.add.collider(this.coins, this.platforms)
		this.physics.add.collider(this.enemies, this.mPlatforms)
		this.physics.add.collider(this.enemies, this.platforms)
		this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this)
		
		this.physics.world.setBounds(0,0,1000,600)
		this.cameras.main.setBounds(0,0,1000,600).startFollow(this.player)
		
		this.gameOver = false
	}
	
	enemyHit(player, enemy){
		this.sndMusic.stop()
		this.physics.pause()
		player.setTint(0xff0000)
		player.anims.stop()
		this.gameOver = true
		
		setTimeout(()=>{
			this.add.text(game.config.width/2,game.config.height/2,'GAME OVER',{fontSize:'50px'})
				.setOrigin(.5)
				.setShadow(0,0,'#000',3)
				.setScrollFactor(0)
				
				setTimeout(()=>{
				this.add.text(game.config.width/2,game.config.height/2 + 50,'PRESS ENTER',{fontSize:'32px'})
					.setOrigin(.5)
					.setScrollFactor(0)
					
				this.input.keyboard.addKey('enter')
					.on('down',()=>{
						this.scene.start('StartScene')
					})
			},1000)
		},1000)
	}
	
	setScore(){
		this.txtScore.setText(this.score > 9 ? `SCORE: ${this.score}` : `SCORE: 0${this.score}`)
	}
	
	collectCoin(p, coin){
		this.sndGetCoin.play()
		coin.destroy()
		this.score++
		this.setScore()
		
		if(this.coins.countActive() <= 0){
			this.sndMusic.stop()
			this.scene.start('EndScene')
		}
	}
	
	movePlatform(p){
		if(p.x < p.minX || p.x > p.maxX){
			p.speed *= -1
		}
		p.x += p.speed
	}
	
	platformMovingThings(sprite,plat){
		sprite.x += plat.speed
	}
	
	update(){
		if(!this.gameOver){
			if(this.control.left.isDown){
				this.player.flipX = true
				this.player.anims.play('walk',true)
				this.player.setVelocityX(-150)
			} else 
			if(this.control.right.isDown){
				this.player.flipX = false
				this.player.anims.play('walk',true)
				this.player.setVelocityX(150)
			} else {
				this.player.setVelocityX(0).setFrame(0)
			}
			
			if(!this.player.body.touching.down){
				this.player.setFrame(
					this.player.body.velocity.y < 0 ? 1 : 3
				)
			}
			
			if(this.control.up.isDown && this.player.canJump && this.player.body.touching.down){
				this.sndJump.play()
				this.player.setVelocityY(-500)
				this.player.canJump = false
			}
			
			if(!this.control.up.isDown && !this.player.canJump && this.player.body.touching.down){
				this.player.canJump = true
			}
			
			this.mPlatforms.children.iterate((plat) => {
				this.movePlatform(plat)
			})
		}
	}
}
