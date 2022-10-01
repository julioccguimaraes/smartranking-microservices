import { Player } from "src/player/interfaces/player.interface";
import { ChallengeStatus } from "../challenge.status.enum";

export interface Challenge {
    dateHourChallenge: Date
    status: ChallengeStatus
    dateHourRequest: Date
    dateHourResponse: Date
    requester: Player
    category: string
    match?: string
    players: Player[]
}
