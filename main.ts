namespace SpriteKind {
    export const Zombie = SpriteKind.create()
    export const Text = SpriteKind.create()
    export const StatusBar = SpriteKind.create()
    export const Bomb = SpriteKind.create()
}
/**
 * reason weapons not cycling is because there is more than one of that weapon
 */
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (P1_using_whip) {
        Enemy_Health[Enemy_List.indexOf(otherSprite)] = Enemy_Health[Enemy_List.indexOf(otherSprite)] - Weapon_DMG
        if (Enemy_Health[Enemy_List.indexOf(otherSprite)] <= 0) {
            info.changeScoreBy(1)
            Enemies_Eliminated += 1
            sprites.destroy(otherSprite)
        }
    }
})
function Grenade () {
    Weapon_DMG = 12
    if (Direction == 1) {
        projectile = sprites.createProjectileFromSprite(assets.image`myImage`, Player_1, 0, -100)
    } else if (Direction == 2) {
        projectile = sprites.createProjectileFromSprite(assets.image`myImage`, Player_1, 100, 0)
    } else if (Direction == 3) {
        projectile = sprites.createProjectileFromSprite(assets.image`myImage`, Player_1, 0, 100)
    } else if (Direction == 4) {
        projectile = sprites.createProjectileFromSprite(assets.image`myImage`, Player_1, -100, 0)
    }
    projectile.setKind(SpriteKind.Bomb)
    pause(500)
    sprites.destroy(projectile, effects.fire, 500)
    projectile.vx = 0
    projectile.vy = 0
}
sprites.onOverlap(SpriteKind.Bomb, SpriteKind.Enemy, function (sprite, otherSprite) {
    Enemy_Health[Enemy_List.indexOf(otherSprite)] = Enemy_Health[Enemy_List.indexOf(otherSprite)] - Weapon_DMG
    if (Enemy_Health[Enemy_List.indexOf(otherSprite)] <= 0) {
        info.changeScoreBy(1)
        Enemies_Eliminated += 1
        sprites.destroy(otherSprite, effects.warmRadial, 500)
    }
    pause(1000)
})
function Spawn_Zombie () {
    Enemy_List.unshift(sprites.create(assets.image`Zombie`, SpriteKind.Enemy))
    Enemy_Health.unshift(10)
    Enemy_DMG.unshift(1)
    Enemy_List[0].setPosition(randint(0, 256), randint(0, 256))
    Enemy_List[0].follow(Player_1, 30)
}
info.onLifeZero(function () {
    game.gameOver(false)
})
function Start_Wave () {
    game.splash("Wave " + convertToText(Wave) + " Starting!")
    Enemies_Eliminated = 0
    Enemies_left_in_wave = Wave * 2 + 8
    Wave_Active = true
    info.startCountdown(Wave * 2 + 18)
    while (Wave_Active) {
        if (Enemies_left_in_wave > 1) {
            New_enemy()
            Enemies_left_in_wave += -1
        } else {
            break;
        }
        pause(2000)
    }
    pauseUntil(() => info.countdown() <= 0)
    Enemy_List = []
    Enemy_Health = []
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.Bomb)
    game.splash("Wave Complete!", "" + Enemies_Eliminated + " Enemies eliminated this wave!")
    if (Enemies_Eliminated >= Enemies_left_in_wave - 3) {
        if (Wave <= 3) {
            Award_Weapon(1)
        } else if (Wave <= 7) {
            Award_Weapon(2)
        } else if (Wave <= 10) {
            Award_Weapon(3)
        } else if (Wave <= 15) {
            Award_Weapon(4)
        } else if (Wave <= 25) {
            Award_Weapon(5)
        }
    }
    info.startCountdown(10)
    Wave += 1
    info.changeLifeBy(3)
    if (Wave % 5 == 0) {
        game.splash("HP Upgrade!", "Reached Wave " + Wave + "!")
        info.setLife(Wave + 15)
    }
    pause(10000)
    Start_Wave()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    Select_weapon(Unlocked_WEAPON_LIST.indexOf(Weapon) + 1)
    story.printDialog("Weapon:" + Weapon, 155, 130, 50, 300)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    Attack_with(Weapon)
})
function Shuriken () {
    Weapon_DMG = 7
    if (Direction == 1) {
        projectile = sprites.createProjectileFromSprite(assets.image`Shuriken`, Player_1, 0, -200)
    } else if (Direction == 2) {
        projectile = sprites.createProjectileFromSprite(assets.image`Shuriken`, Player_1, 200, 0)
    } else if (Direction == 3) {
        projectile = sprites.createProjectileFromSprite(assets.image`Shuriken`, Player_1, 0, 200)
    } else if (Direction == 4) {
        projectile = sprites.createProjectileFromSprite(assets.image`Shuriken`, Player_1, -200, 0)
    }
    animation.runImageAnimation(
    projectile,
    assets.animation`myAnim`,
    100,
    true
    )
}
function Whip () {
    Weapon_DMG = 25
    if (Direction == 1) {
        Player_1.setImage(assets.image`P1 whip up`)
    } else if (Direction == 2) {
        Player_1.setImage(assets.image`P1 whip right 2`)
    } else if (Direction == 3) {
        Player_1.setImage(assets.image`P1 whip down2`)
    } else if (Direction == 4) {
        Player_1.setImage(assets.image`P1 whip left 2`)
    }
    P1_using_whip = true
    pause(50)
    Player_1.setImage(assets.image`P1`)
    P1_using_whip = false
}
function Attack_with (weapon: string) {
    if (weapon == "Pistol") {
        Pistol()
    } else if (weapon == "Shuriken") {
        Shuriken()
    } else if (weapon == "Shield") {
        if (!(Shield_thrown)) {
            Shield()
        }
    } else if (weapon == "Grenade") {
        Grenade()
    } else if (weapon == "AR") {
        AR()
    } else if (weapon == "Whip") {
        Whip()
    } else if (weapon == "Sword") {
        Sword()
    } else {
    	
    }
}
function Spawn_Small_Zombie () {
    Enemy_List.unshift(sprites.create(assets.image`Small Zombie`, SpriteKind.Enemy))
    Enemy_Health.unshift(5)
    Enemy_DMG.unshift(1)
    Enemy_List[0].setPosition(randint(0, 256), randint(0, 256))
    Enemy_List[0].follow(Player_1, 40)
}
function Weapon_Rarity_Upgrade () {
    if (Wave == 4) {
        game.splash("All Common Weapons Unlocked!")
        game.splash("Next: Uncommon", "Choose 1 Weapon To Keep:")
        controller.moveSprite(Player_1, 0, 0)
        story.showPlayerChoices(Unlocked_WEAPON_LIST[0], Unlocked_WEAPON_LIST[1], Unlocked_WEAPON_LIST[2])
    } else if (Wave == 7) {
        game.splash("All Uncommon Weapons Unlocked!")
        game.splash("Next: Rare", "Choose 1 Weapon To Keep:")
        controller.moveSprite(Player_1, 0, 0)
        story.showPlayerChoices(Unlocked_WEAPON_LIST[0], Unlocked_WEAPON_LIST[1], Unlocked_WEAPON_LIST[2], Unlocked_WEAPON_LIST[2])
    }
    Unlocked_WEAPON_LIST = [story.getLastAnswer()]
    controller.moveSprite(Player_1, 100, 100)
}
function Award_Weapon (Rarity: number) {
    BOOL = true
    if (Rarity == 1) {
        Randomizer = randint(1, 2)
    } else if (Rarity == 2) {
        Randomizer = randint(3, 7)
    } else if (Rarity == 3) {
    	
    } else if (Rarity == 4) {
    	
    } else if (Rarity == 5) {
    	
    }
    for (let value of Unlocked_WEAPON_LIST) {
        if (value == Locked_Weapon_List[Randomizer]) {
            BOOL = false
        }
    }
    if (BOOL) {
        game.splash("New Weapon!", Locked_Weapon_List[Randomizer])
        Unlocked_WEAPON_LIST.push(Locked_Weapon_List[Randomizer])
    } else {
        Award_Weapon(Rarity)
    }
}
function Sword () {
    Weapon_DMG = 20
    WeaponSprite = sprites.create(assets.image`Sword`, SpriteKind.Bomb)
    WeaponSprite.setPosition(Player_1.x, Player_1.y)
    WeaponSprite.follow(Player_1, 1000)
    if (Direction == 1) {
        transformSprites.rotateSprite(WeaponSprite, 0)
    } else if (Direction == 2) {
        transformSprites.rotateSprite(WeaponSprite, 90)
    } else if (Direction == 3) {
        transformSprites.rotateSprite(WeaponSprite, 180)
    } else if (Direction == 4) {
        transformSprites.rotateSprite(WeaponSprite, 270)
    }
    for (let index = 0; index < 18; index++) {
        transformSprites.changeRotation(WeaponSprite, 10)
        pause(0.1)
    }
    sprites.destroy(WeaponSprite)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    Direction = 3
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    Direction = 1
})
function New_enemy () {
    if (Wave >= 9) {
        Randomizer = randint(1, 7)
        if (Randomizer <= 3) {
            Spawn_Zombie()
        } else if (Randomizer <= 4) {
            Spawn_Small_Zombie()
        } else if (Randomizer <= 5) {
            Spawn_Buff_Zombie()
        } else {
            Spawn_Angry_Zombie()
        }
    }
    if (Wave >= 6) {
        Randomizer = randint(1, 7)
        if (Randomizer <= 4) {
            Spawn_Zombie()
        } else if (Randomizer <= 5) {
            Spawn_Small_Zombie()
        } else {
            Spawn_Buff_Zombie()
        }
    }
    if (Wave >= 4) {
        Randomizer = randint(0, 3)
        if (Randomizer <= 2) {
            Spawn_Zombie()
        } else {
            Spawn_Small_Zombie()
        }
    }
    if (Wave < 4) {
        Spawn_Zombie()
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    Direction = 2
})
function Spawn_Angry_Zombie () {
    Enemy_List.unshift(sprites.create(assets.image`Angry Zombie`, SpriteKind.Enemy))
    Enemy_Health.unshift(20)
    Enemy_DMG.unshift(2)
    Enemy_List[0].setPosition(randint(0, 256), randint(0, 256))
    Enemy_List[0].follow(Player_1, 30)
}
function Select_weapon (weapon_num: number) {
    if (weapon_num > Unlocked_WEAPON_LIST.length - 1) {
        Weapon = Unlocked_WEAPON_LIST[0]
    } else {
        Weapon = Unlocked_WEAPON_LIST[weapon_num]
    }
}
function Pistol () {
    Weapon_DMG = 5
    if (Direction == 1) {
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet UD`, Player_1, 0, -150)
    } else if (Direction == 2) {
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet LR`, Player_1, 150, 0)
    } else if (Direction == 3) {
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet UD`, Player_1, 0, 150)
    } else if (Direction == 4) {
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet LR`, Player_1, -150, 0)
    }
}
function Spawn_Buff_Zombie () {
    Enemy_List.unshift(sprites.create(assets.image`Buff Zombie`, SpriteKind.Enemy))
    Enemy_Health.unshift(25)
    Enemy_DMG.unshift(2)
    Enemy_List[0].setPosition(randint(0, 256), randint(0, 256))
    Enemy_List[0].follow(Player_1, 20)
}
function Shield () {
    Shield_thrown = true
    Weapon_DMG = 15
    if (Direction == 1) {
        projectile = sprites.createProjectileFromSprite(assets.image`Shield`, Player_1, 0, -150)
    } else if (Direction == 2) {
        projectile = sprites.createProjectileFromSprite(assets.image`Shield`, Player_1, 150, 0)
    } else if (Direction == 3) {
        projectile = sprites.createProjectileFromSprite(assets.image`Shield`, Player_1, 0, 150)
    } else if (Direction == 4) {
        projectile = sprites.createProjectileFromSprite(assets.image`Shield`, Player_1, -150, 0)
    }
    projectile.setKind(SpriteKind.Bomb)
    projectile.setStayInScreen(true)
    projectile.setBounceOnWall(true)
    animation.runImageAnimation(
    projectile,
    assets.animation`Shield`,
    100,
    true
    )
    pause(3000)
    Shield_thrown = false
    sprites.destroy(projectile)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    Direction = 4
})
info.onCountdownEnd(function () {
    Wave_Active = false
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    Enemy_Health[Enemy_List.indexOf(otherSprite)] = Enemy_Health[Enemy_List.indexOf(otherSprite)] - Weapon_DMG
    sprites.destroy(sprite)
    if (Enemy_Health[Enemy_List.indexOf(otherSprite)] <= 0) {
        info.changeScoreBy(1)
        Enemies_Eliminated += 1
        sprites.destroy(otherSprite)
    }
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    if (!(P1_using_whip)) {
        info.changeLifeBy(Enemy_DMG[Enemy_List.indexOf(sprite)] * -1)
        pause(500)
    }
})
function AR () {
    Weapon_DMG = 10
    if (Direction == 1) {
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet UD`, Player_1, 0, -125)
    } else if (Direction == 2) {
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet LR`, Player_1, 125, 0)
    } else if (Direction == 3) {
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet UD`, Player_1, 0, 125)
    } else if (Direction == 4) {
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet LR`, Player_1, -125, 0)
    }
}
let WeaponSprite: Sprite = null
let Randomizer = 0
let BOOL = false
let Shield_thrown = false
let Enemies_left_in_wave = 0
let projectile: Sprite = null
let Direction = 0
let Enemies_Eliminated = 0
let P1_using_whip = false
let Enemy_DMG: number[] = []
let Weapon_DMG = 0
let Enemy_Health: number[] = []
let Enemy_List: Sprite[] = []
let Wave = 0
let Wave_Active = false
let Weapon = ""
let Locked_Weapon_List: string[] = []
let Unlocked_WEAPON_LIST: string[] = []
let Player_1: Sprite = null
Player_1 = sprites.create(assets.image`P1`, SpriteKind.Player)
tiles.setCurrentTilemap(tilemap`level1`)
controller.moveSprite(Player_1, 100, 100)
Player_1.setStayInScreen(false)
scene.cameraFollowSprite(Player_1)
Unlocked_WEAPON_LIST = ["Pistol"]
Locked_Weapon_List = [
"Pistol",
"Shuriken",
"Grenade",
"Shield",
"AR",
"Whip",
"Sword"
]
Weapon = "Pistol"
Wave_Active = true
info.setLife(10)
info.setScore(0)
Wave = 1
Enemy_List = []
Enemy_Health = []
Weapon_DMG = 5
Enemy_DMG = []
game.setGameOverMessage(false, "Game Over! High Score: " + info.highScore())
Start_Wave()
