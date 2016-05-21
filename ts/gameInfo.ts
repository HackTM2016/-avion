
type Identifier = string

class GameInfo
{
    name: string
    numberOfPlayers: number
    numberOfPlanesPerPlayer: number
}

interface PlayerDefinitionModel
{
    setPlayerName(name: string, success: (s: boolean) => void): void
}

interface GameJoinModel
{
    init(numberOfGames: number): void
    onAdd(callback: (item: GameInfo) => void): void
    onRemove(callback: (id: Identifier) => void): void
    
    join(id: Identifier, success: (s: boolean) => void, start: (item: GameInfo) => void) : void
}

interface GameCreateModel
{
    create(board: GameInfo, callback: (success: boolean) => void)
}
