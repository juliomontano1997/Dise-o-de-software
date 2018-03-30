export class boardSessionHandler {
    private sessionId: number;
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
    constructor(sessionId:number, playerPlayingId:number){
        this.sessionId=sessionId;
        this.playerPlayingId=playerPlayingId;
        this.boardSize=0;
    }
    
    public setBoardSizeArray(){
        this.boardSizeArray= new Array<number> (this.boardSize);
        let i:number=0;
        for (i=0; i < this.boardSize;i++) {
            this.boardSizeArray[i]=i;
        }
        
    }

    public UpdateData(dataArray: Array<any>){

        this.actualPlayerId=dataArray[0].o_actualplayerid;
        this.playerOneColor=dataArray[0].o_colorplayer1;
        this.playerTwoColor=dataArray[0].o_colorplayer2;
        this.setBoard(dataArray[0].o_board);
        if (this.boardSize===0){
            this.boardSize=dataArray[0].o_boardsize;
            this.setBoardSizeArray();
            this.playerOneID=dataArray[0].o_playeroneid;
            this.playerTwoID=dataArray[0].o_playertwoid;
            
        }
   
    }

    public setActualPlayerId():void{
         if (this.playerPlayingId==this.playerTwoID){
            this.actualPlayerId= this.playerOneID;
            }
        else{
            this.actualPlayerId=this.playerTwoID;
            }
        
        
        
    }

    public setSessionId(sessionId:number):void{
        this.sessionId=sessionId;
     }

    public getSessionId():number{
       return this.sessionId;
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
