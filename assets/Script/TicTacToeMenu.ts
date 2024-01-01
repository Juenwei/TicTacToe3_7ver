import { _decorator, Button, Color, Component, Node, RichText, EventTarget } from 'cc';
import { TicTacToeButton } from './TicTacToeButton';
import { WinSingleUI } from './WinSingleUI';
import { ReferenceManager } from './ReferenceManager';

const { ccclass, property } = _decorator;

@ccclass('TicTacToeMenu')
export class TicTacToeMenu extends Component {
    private referenceManagerInstance : ReferenceManager = null;

    @property(RichText)
    playerTurnText : RichText;
    
    @property(Button)
    resetButton : Button;

    @property(Button)
    surrenderButton : Button;

    @property(WinSingleUI)
    winSingleUI: WinSingleUI;

    @property
    disableColor: Color;


    //Events
    public eventTarget  = new EventTarget();
    
    OnPlayerSurrender : string = "OnPlayerSurrender";

    OnPlayerReset : string = "OnPlayerReset";

    //ticTacToeButtons : Array<TicTacToeButton> = new Array<TicTacToeButton>();

    hidedButtons : Array<TicTacToeButton> = new Array<TicTacToeButton>();

    playerTurnString : string = "Current Player Turn : "


    Init(referenceManagerInstance : ReferenceManager){
        this.referenceManagerInstance = referenceManagerInstance;
        console.log("TicTacToeMenu Registered");
    }

    protected onLoad(): void {
        this.resetButton.node.on('click',this.ResetButton_OnReset,this);
        this.surrenderButton.node.on('click',this.SurrenderButton_OnSurrender,this);
    }

    start() {
        
    }

    public UpdateCurrentPlayerTurnUI(playerName : string, playerColor : Color){
        //this.playerTurnText.string = `Current Turn : <color=${playerColor.toHEX}> ${playerName} </color>`;
        //Current Turn : <color=#00ff00>Player A</color>
        let hexCode = playerColor.toHEX("#rrggbb");
        this.playerTurnText.string  = "Current Turn : <color=#" + hexCode +">" + playerName + "</color>"
        console.log("Current Turn : <color=#" + hexCode +">" + playerName + "</color>");
    }


    // public RegisterButton(button : TicTacToeButton){
    //     console.info("Registered Button");
    //     this.ticTacToeButtons.push(button);
    // }

    public ResetMenuProperty(){
        //this.ticTacToeButtons = new Array<TicTacToeButton>();

        //Current use Destoy All and instantiate method which take more resources,later can change to not destroy 
        //this.referenceManagerInstance.TicTacToeButtonInstances.
        this.hidedButtons= new Array<TicTacToeButton>();
    }

    public SurrenderButton_OnSurrender(){
        //Call TicTaeToe Manager
        //let winMessgaeString = TicTacToeManager.instance.Surrender();
        this.eventTarget.emit(this.OnPlayerSurrender);
       
        //Reset
        this.ResetButton_OnReset();
    }

    public ShowSurrenderUI(winMessage : string){
        //Set Win Message
        this.winSingleUI.SetResultMessage(winMessage);
    }

    public ShowWinGame(message : string){
        this.winSingleUI.SetResultMessage(message);

        //Reset or Freeze Board
        this.FreezeBoard();

        this.surrenderButton.interactable = false;
        //this.ResetProgress();
    }

    public ShowDrawGame(){
        this.winSingleUI.SetResultMessage("Splendid, It is a Draw game");
        this.surrenderButton.interactable = false;
    }

    public StoreLoseButtons(buttonsIndexs : Array<number>){

        // let debugMessage = "Avoid Hide Button with index : ";
        // buttonsIndexs.forEach(element => {
        //     debugMessage += element + ", "
        // });
        // console.log(debugMessage);

        let clonedArray  = Object.assign([], this.referenceManagerInstance.TicTacToeButtonInstances);
        buttonsIndexs.forEach(element => {
            const valueToRemove = element;
            clonedArray = clonedArray.filter((ticTacToeButton) => ticTacToeButton.buttonId !== valueToRemove);
        });
        this.hidedButtons = clonedArray;
    
        /* for(let i=0; i < this.ticTacToeButtons.length; i++){
            for(let j=0; j < buttonsIndexs.length; j++){
                if(this.ticTacToeButtons[i].buttonId != buttonsIndexs[j]){
                    this.hidedButtons.push(this.ticTacToeButtons[i]);
                    break;
                }
            }
        } */
    }

    //Private Method
    private ResetButton_OnReset(){
        console.info("Reset Game");

        for(var buttons of this.referenceManagerInstance.TicTacToeButtonInstances){
            buttons.OnButtonReset();
        }

        this.eventTarget.emit(this.OnPlayerReset);
        //TicTacToeManager.instance.ResetBoardClickStatus();
        this.surrenderButton.interactable = true;
    }

    private FreezeBoard(){
        if(this.hidedButtons.length <=0 ){
            console.info("Hided Button is empty while win ,this should not be happen");
        }

        this.hidedButtons.forEach(button => {
            button.UpdateButtonColor(this.disableColor);
        });
    }
}


