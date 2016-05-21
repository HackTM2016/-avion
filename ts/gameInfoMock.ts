/// <reference path="gameInfo.ts"/>

class PlayerDefinitionModelMock implements PlayerDefinitionModel
{
    setPlayerName(name: string, success: (s: boolean) => void): void {
        success(true);
    }
}

class GameJoinModelMock implements GameJoinModel
{
    n : number
    addGame : (item: GameInfo) => void
    removeGame : (id: Identifier) => void
    
    startGame : (item: GameInfo) => void
    
    init(numberOfGames: number): void
    {
        this.n = numberOfGames   
    }
    onAdd(callback: (item: GameInfo) => void): void
    {
        this.addGame = callback;
    }
    onRemove(callback: (id: Identifier) => void): void
    {
        this.removeGame = callback;
    }
    
    join(id: Identifier, success: (s: boolean) => void, start: (item: GameInfo) => void) : void
    {
        this.startGame = start;
        success(true);
    }
}

class GameCreateModelMock implements GameCreateModel
{
    create(board: GameInfo, callback: (success: boolean) => void)
    {
        callback(true);
    }
}
