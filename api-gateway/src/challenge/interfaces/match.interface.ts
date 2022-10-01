import { Player } from "src/player/interfaces/player.interface"

export interface Match {
    category?: string
    challenge?: string
    players?: Player[]
    challenger?: Player
    result?: Result[]  
}

export interface Result {
    set: string
}
