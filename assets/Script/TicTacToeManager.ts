import { _decorator, Color, Component, EventTarget, randomRangeInt, Vec2 } from 'cc';
import { TicTacToeSpawner } from './TicTacToeSpawner';
import { ReferenceManager } from './ReferenceManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
class Player {
    @property
    playerIndex : number;

    @property
    playerName : string;

    @property
    playerColor : Color;

    constructor(){
        this.playerIndex = 999999999;
        this.playerName = "Default";
        //Typescript cannot use Color.White since it is readonly
        this.playerColor = new Color(255,255,255);
    }
}

export enum ResultType{
    win,
    lose,
    draw,
}

@ccclass('TicTacToeManager')
export class TicTacToeManager extends Component {
    //Roles (Singetlon)
    //1. Manage Player Turn.
    //2. Check Answer once submit.
    //3. Reset Feature.
    //4. Trigger Winning Feedback.
    public static instance : TicTacToeManager;
    private referenceManagerInstance : ReferenceManager = null;

    @property([Player])
    players: Player[] = [];

    private boardSize : Vec2 = new Vec2();

    //1D array
    boardValues : Array<number> = new Array<number>();

    currentIndex : number = 0;

    private matchCount = 3;

    //Event
    eventTarget : EventTarget = new EventTarget(); 
    OnPlayerPressedButton : string = "OnPlayerPressedButton";

    Init(referenceManagerInstance : ReferenceManager){
        this.referenceManagerInstance = referenceManagerInstance;
    }
    
    protected onLoad(): void {
        if(TicTacToeManager.instance !=null && TicTacToeManager.instance != this)
        {
            this.node.destroy()
        }else
        {
            TicTacToeManager.instance = this;
        }
    }

    start() {
        //Initialized to the default Size which is 3X3
        this.boardSize.x = 3;
        this.boardSize.y = 3;
        this.ResetBoardValues(this.boardSize, this.matchCount);
        TicTacToeSpawner.Instance.SpwanTicTacToeBoard(this.boardSize);

        var ticTacToeMenu = this.referenceManagerInstance.TicTacToeMenuInstance;
        ticTacToeMenu.eventTarget.on(ticTacToeMenu.OnPlayerSurrender,this.TicTacToeMenu_OnPlayerSurrender, this);
        ticTacToeMenu.eventTarget.on(ticTacToeMenu.OnPlayerReset,()=>{
            this.ResetBoardClickStatus();
        },this);
    }

    public SubmitTicTacToe(submitId : number,)
    {
        
        var currentPlayer = this.players[this.currentIndex];

        //Update co
        this.eventTarget.emit(this.OnPlayerPressedButton, {buttonId : submitId, buttonColor : currentPlayer.playerColor});

        //Get Player Index
        var playerIndex = currentPlayer.playerIndex;
        //Insert Selected board
        if(submitId < 0 || submitId >= this.boardValues.length)
        {
            console.log("Invalide Submit id ,please check the button id clicked");
        }
        this.boardValues[submitId] = playerIndex;

        //#region Debug Area
        this.DebugBoardValue();
        //#endregion
        
        var ticTacToeMenu = this.referenceManagerInstance.TicTacToeMenuInstance; 
        //Check Win condition
        let currentResultType = this.CheckAnswer(playerIndex,submitId);
        if(currentResultType == ResultType.win){
            //Stop Game and Display Win Message
            ticTacToeMenu.ShowWinGame(this.Win())
        }
        else if(currentResultType == ResultType.draw)
        {
            ticTacToeMenu.ShowDrawGame();
        }
        else{
            //Switch to next player
            this.TakeRoutine();
        }
    }

    public ResetBoardClickStatus(){
        //Clear Board
        console.info("Reset Board data");

        for(let i=0;i<this.boardValues.length;i++){
            this.boardValues[i] = 0;
        }
        this.DebugBoardValue();

        //Random Player
        this.currentIndex = randomRangeInt(0,this.players.length);

        this.referenceManagerInstance.TicTacToeMenuInstance.UpdateCurrentPlayerTurnUI(this.players[this.currentIndex].playerName
            ,this.players[this.currentIndex].playerColor);
    }

    public TicTacToeMenu_OnPlayerSurrender() : void{
        
        this.TakeRoutine();
        let winPlayer = this.players[this.currentIndex]

        this.referenceManagerInstance.TicTacToeMenuInstance.ShowSurrenderUI(this.GenerateWinMessage(winPlayer));
    }

    public Win() : string{
        console.info("Detect WIn condition");
        return this.GenerateWinMessage(this.players[this.currentIndex]);
    }

    public ResetBoardValues(boardSize : Vec2, matchCount : number)
    {
        this.MatchCount = matchCount;
        this.ResetBoardClickStatus();
        this.referenceManagerInstance.TicTacToeMenuInstance.ResetMenuProperty();
        this.boardSize =  boardSize;
        var boardButtonAmount = boardSize.x * boardSize.y;
        if(this.boardValues.length != 0){
            this.boardValues = new Array<number>();
        }
   
        for(let i =0;i < boardButtonAmount; i++)
        {
            this.boardValues.push(0);
        }
    }

    //Private Method (Optimize It, DO Calculation at once)
    private CheckAnswer(playerIndex : number, selectedBoardIndex : number) : ResultType
    {
        console.info("Receive Click, Checking Answer");
        console.log("Board Size : " + this.boardSize.x, + "," +  this.boardSize.y);

        const BOARD_WIDTH =  this.boardSize.y;
        const currentRows = Math.floor(selectedBoardIndex/BOARD_WIDTH);

        var ticTacToeMenu = this.referenceManagerInstance.TicTacToeMenuInstance;

        let timeOfCheckforRow = this.boardSize.x - 2;
        for(let j=0; j < timeOfCheckforRow; j++)
            {
                var matchCount = 0;
                let tempWinButtonIndexArray : Array<number> = new Array<number>();
                //Row
                for(let k=0; k < this.matchCount; k++){
                    var calculatedIndex = currentRows * this.boardSize.y + k + j;
                    if(this.boardValues[calculatedIndex] == playerIndex){
                        matchCount ++;
                        tempWinButtonIndexArray.push(calculatedIndex)
                    }
                    else{
                        matchCount = 0;
                        break;
                    }
                }

                if(matchCount == this.matchCount){
                    ticTacToeMenu.StoreLoseButtons(tempWinButtonIndexArray);
                    return ResultType.win;
                }
            }

        const currentColumns = selectedBoardIndex % BOARD_WIDTH;
        let timeOfCheckforColumn = this.boardSize.y - 2;
            for(let j=0; j < timeOfCheckforColumn; j++)
            {
                //Column
                var matchCount = 0;
                let tempWinButtonIndexArray : Array<number> = new Array<number>();

                //Row
                for(let k=0; k < this.matchCount; k++){
                    var calculatedIndex = currentColumns +  (this.boardSize.x* k) + j * this.boardSize.x
                    if(this.boardValues[calculatedIndex] == playerIndex){
                        matchCount ++;
                        tempWinButtonIndexArray.push(calculatedIndex)
                    }
                    else{
                        matchCount = 0;
                        break;
                    }
                }

                if(matchCount == this.matchCount){
                    ticTacToeMenu.StoreLoseButtons(tempWinButtonIndexArray);
                    return ResultType.win;
                }
        }

        //Diagonal
        for(let index = 0; index < this.boardValues.length ; index++){
             if(this.CheckDigonal_TopLeftToBottomRight(index,playerIndex)){
                return ResultType.win;
             }

             if(this.CheckDigonal_TopRightToBottomLeft(index,playerIndex)){
                return ResultType.win;
             }
        }

        //Check is Draw 
        if(this.boardValues.find((obj) => obj.valueOf() === 0) == undefined){
            console.log("It is Draw")
            return ResultType.draw;
        }

        console.log("No WIn Condition met");
        return ResultType.lose;
    }

    private CheckDigonal_TopLeftToBottomRight(index : number, playerIndex : number) : boolean
    {
        var tempWinButtonIndexArray : Array<number> = new Array<number>();
        //These Variable Need to be pass in
        const MAX_BOARD_SIZE = Math.max(this.boardSize.x,this.boardSize.y);
        const BOARD_WIDTH = this.boardSize.y;

        //Switch to 2D array
        const currentColumns = index % BOARD_WIDTH;
        const currentRows = Math.floor(index/BOARD_WIDTH);

        const maxValue = Math.max(currentColumns,currentRows);

        //Find index in 2D array
        const startPoint = {x : currentColumns  ,y : currentRows }

        //Iteration decide how much loop to run without out of board's bound
        const iteration = MAX_BOARD_SIZE - maxValue;

        //Let skip it if it less than 3 iteration, because it 100% no the one we looking
        if(iteration < this.matchCount){
            return false;
        }


        let match_count = 0;
        for(let i = 0; i < iteration; i++){
            if(this.Match(startPoint.x, startPoint.y,playerIndex)){
                match_count++;
                tempWinButtonIndexArray.push(startPoint.x + startPoint.y * BOARD_WIDTH)

                //Let it break once found 3 match (Reduce Unnessary Calculation)
                if(match_count == this.matchCount){
                    break;
                }
            }
            else{
                match_count = 0;
                break;
            }

            startPoint.x++;
            startPoint.y++;
        }
        if(match_count == this.matchCount){
            console.log("Found Valid diagonal for win");
            this.referenceManagerInstance.TicTacToeMenuInstance.StoreLoseButtons(tempWinButtonIndexArray);
            return true;
        }
        else{
            return false;
        }
    }

    private Match(colunm : number ,row : number, playerIndex : number) : boolean{
        const BOARD_WIDTH = this.boardSize.y;
        const tempIndex = colunm + row * BOARD_WIDTH;

        //CHeck feature 
        if(this.boardValues[tempIndex] == playerIndex){
            //document.write("FOund Match at index : " + tempIndex);
            return true;
        }
        else{
            //document.write("No Found at index : " + tempIndex);
            return false;
        }
    }

    private CheckDigonal_TopRightToBottomLeft(index : number, playerIndex : number) : boolean
    {
        var tempWinButtonIndexArray : Array<number> = new Array<number>();

        const BOARD_WIDTH = this.boardSize.x;
        const BOARD_LENGTH = this.boardSize.y;
        const MAX_BOARD_SIZE = Math.max(BOARD_WIDTH,BOARD_LENGTH);
        const MAX_INDEX = MAX_BOARD_SIZE - 1; 
        

        //Modulus will find the number 
        const currentColumns = index % BOARD_LENGTH;
        const currentRows = Math.floor(index/BOARD_WIDTH);

        //Find
        const startPoint = {x : currentColumns  ,y : currentRows }

        const iteration = MAX_BOARD_SIZE - Math.max (currentRows,MAX_INDEX - currentColumns);

        if(iteration < this.matchCount){
            return false;
        }

        let match_count = 0;
        for(let i = 0; i < iteration; i++){
            if(this.Match(startPoint.x, startPoint.y,playerIndex)){
                match_count++;
                tempWinButtonIndexArray.push(startPoint.x + startPoint.y * BOARD_WIDTH);

                //Let it break once found 3 match
                if(match_count == this.matchCount){
                    break;
                }
            }
            else{
                match_count = 0;
                break;
            }

            startPoint.x--
            startPoint.y++;
        }

        if(match_count == this.matchCount){
            console.log("Found Valid diagonal for win");
            this.referenceManagerInstance.TicTacToeMenuInstance.StoreLoseButtons(tempWinButtonIndexArray);
            return true;
        }
        else{
            return false;
        }
}

    private TakeRoutine(){
        this.currentIndex++;
        if(this.currentIndex >= this.players.length)
        {
            this.currentIndex = 0;
        }
        this.referenceManagerInstance.TicTacToeMenuInstance.UpdateCurrentPlayerTurnUI(this.players[this.currentIndex].playerName,
            this.players[this.currentIndex].playerColor);
    }

    private GenerateWinMessage(winPlayer : Player ) : string
    {
        let hexCode = winPlayer.playerColor.toHEX("#rrggbb");
        let winMessageString = "Congrats, <color=#" + hexCode +">" + winPlayer.playerName + "</color> has won the game";
        

        return winMessageString
    }


    //GETTER SETTER
    // public get TicTacToeMenu(){
    //     return this.ticTacToeMenu;
    // }

    public set BoardSize(newBoardSize : Vec2){
        this.boardSize = newBoardSize
        console.log("Update Board Size, Value : " + this.boardSize);
    }

    public set MatchCount(matchCount : number){
        this.matchCount = matchCount;
    }

    //Debug FUnction
    DebugBoardValue(){
        let boardValueString = "Board Value : { ";
        this.boardValues.forEach(element => {
            boardValueString += element + ", "
        });
        boardValueString += " } ";
        console.info(boardValueString);
    }

}

