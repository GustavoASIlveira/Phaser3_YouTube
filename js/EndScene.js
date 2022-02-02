class EndScene extends Phaser.Scene{
	constructor(){
		super('EndScene')
	}
	
	create(){
		this.add.image(0,0,'end').setOrigin(0)
		
		setTimeout(()=>{
			this.add.text(game.config.width/2,game.config.height/2 + 50,'PRESS ENTER',{fontSize:'32px'})
				.setOrigin(.5)
				
			this.input.keyboard.addKey('enter')
				.on('down',()=>{
					this.scene.start('StartScene')
				})
		},1000)
	}
}
