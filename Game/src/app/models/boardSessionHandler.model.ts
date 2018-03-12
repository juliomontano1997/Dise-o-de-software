export class boardSessionHandler {
    private playerOneID:number;
    private playerTwoID:number;
    private actualPlayerId:number;
    private boardSize:number;
    private board: number[];
    private playerOneColor: String;
    private playerTwoColor:String;
    private playerPlayingId: number;
    private boardSizeArray: number[];

    /**
     * 
     * @param playerOneID 
     * @param playerTwoID 
     * @param actualPlayerId 
     * @param boardSize 
     * @param board 
     * @param playerOneColor 
     * @param playerTwoColor 
     * @param playerPlayingId it's necessaru to know when disabled the board to the player 
     */
    constructor(playerOneID:number, playerTwoID:number, actualPlayerId:number, boardSize:number,
        board: number[], playerOneColor: String, playerTwoColor:String,playerPlayingId: number){
        this.playerOneID=playerOneID;
        this.playerTwoID=playerTwoID;
        this.actualPlayerId=actualPlayerId;
        this.boardSize= boardSize;
        this.board= board;
        this.playerOneColor=playerOneColor;
        this.playerTwoColor=playerTwoColor;
        this.playerPlayingId=playerPlayingId;
        this.setBoardSizeArray();
    }
    
    public setBoardSizeArray(){
        this.boardSizeArray= new Array<number> (this.boardSize);
        let i:number=0;
        for (i=0; i < this.boardSize;i++) {
            this.boardSizeArray[i]=i;
        }
    }

    public setActualPlayerId(playerId: number):void{
        this.actualPlayerId=playerId;
    }

    public getPlayerOneId(): number{
        return this.playerOneID;
    }

    public getPlayerTwoId(): number{
        return this.playerTwoID;
    }

    public getBoardSize(): number {
        return this.boardSize;
    }

    public getBoard(): number[]{
        return this.board;
    }

    public getPlayerOneColor(): String{
        return this.playerOneColor;
    }

    public getPlayerTwoColor(): String{
        return this.playerTwoColor;
    }

    public getPlayerPlayingId(): number{
        return this.playerPlayingId;
    }

    public getBoardSizeArray():number[]{
        return this.boardSizeArray;
    }

    public setBoard(board:number[]): void{
        this.board=board;
    }


    public itsMyTurn(): boolean{
        return this.actualPlayerId==this.playerPlayingId;
    }
}
