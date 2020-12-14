const ATTACK_VALUE = 10
const STRONG_ATTACK_VALUE = 17
const MONSTER_ATTACK_VALUE  = 14
const HEAL_VALUE = 15

const MODE_ATTACK = 'ATTACK'
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK'
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK'
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK'
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL'
const LOG_EVENT_GAME_OVER = 'GAME_OVER'

const enteredValue = prompt('Maximum life for you and the monster', '100')

let chossenMaxLife = parseInt(enteredValue)
let battleLog = []

if (isNaN(chossenMaxLife) || chossenMaxLife <= 0) {
    chossenMaxLife = 100
}

let currentMonsterHealth = chossenMaxLife
let currentPlayerHealth = chossenMaxLife
let hasBonusLife = true

adjustHealthBars(chossenMaxLife)

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    }
    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER'
            break
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER'
            break
        case  LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER'
            break
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER'
            break
        default: 
            logEntry = {}
    }
    battleLog.push(logEntry)
}

function reset() {
    currentMonsterHealth = chossenMaxLife
    currentPlayerHealth = chossenMaxLife
    resetGame(chossenMaxLife)
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHealth -= playerDamage
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK, 
        playerDamage, 
        currentMonsterHealth, 
        currentPlayerHealth
    )

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false
        removeBonusLife()
        currentPlayerHealth = initialPlayerHealth
        setPlayerHealth(initialPlayerHealth)
        alert('You would be dead but the bonus live saved you!' )
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!')
        writeToLog(
            LOG_EVENT_GAME_OVER, 
            'PLAYER WON', 
            currentMonsterHealth, 
            currentPlayerHealth
        )
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!')
        writeToLog(
            LOG_EVENT_GAME_OVER, 
            'MONSTER WON', 
            currentMonsterHealth, 
            currentPlayerHealth
        )
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw!')
        writeToLog(
            LOG_EVENT_GAME_OVER, 
            'A DRAW', 
            currentMonsterHealth, 
            currentPlayerHealth
        )
    }
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset()
    }
}

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK
    const damage = dealMonsterDamage(maxDamage)
    currentMonsterHealth -= damage
    writeToLog(
        logEvent, 
        damage, 
        currentMonsterHealth, 
        currentPlayerHealth
    )
    endRound()
}

function attackHandler() {
    attackMonster(MODE_ATTACK)
}
    
function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK)
}

function healPlayerHandler() {
    let healValue
    if (currentPlayerHealth >= chossenMaxLife - HEAL_VALUE) {
        alert("you can't heal to more than your max initial health")
        healValue = chossenMaxLife - currentPlayerHealth
    } else {
        healValue = HEAL_VALUE
    }
    increasePlayerHealth(healValue)
    currentPlayerHealth += healValue
    writeToLog(
        LOG_EVENT_PLAYER_HEAL, 
        healValue, 
        currentMonsterHealth, 
        currentPlayerHealth
    )
    endRound()
}

function printLogHandler() {
    let i = 0
    for (const logEntry of battleLog) {
    console.log(`#${i}`);
    for (const key in logEntry) {
        console.log(`${key} => ${logEntry[key]}`)
    }
    i++
    }
}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click',printLogHandler)
