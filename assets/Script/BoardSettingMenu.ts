import { _decorator, Button, Component, EditBox, Label, Node ,EventHandler, CCInteger, Vec2, EventTarget, macro } from 'cc';
import { TicTacToeManager } from './TicTacToeManager';
import { TicTacToeSpawner } from './TicTacToeSpawner';
import { ReferenceManager } from './ReferenceManager';
const { ccclass, property } = _decorator;

//const eventTarget = new EventTarget();

@ccclass('BoardSettingMenu')
export class BoardSettingMenu extends Component {
    private referenceManagerInstance : ReferenceManager = null;

    @property(Label)
    yInputUI : Label;

    @property(Label)
    errorMessageLabel : Label;

    @property(Button)
    generateButton : Button;

    @property(Button)
    cancelButton : Button;

    @property(Button)
    boardSettingButton : Button;

    @property(CCInteger)
    minSize = 3;

    @property(CCInteger)
    maxSize = 6;

    private boardSizeSetting : number;
    private matchCountSetting : number = 0;
    
    private isXValueValid : boolean = false;
    private errorMessage : string = "Invalid Size, Size of board should be in range of 3 to 6!!"

    public eventTarget = new EventTarget();
    public OnEnterValidBoardSize : string = "OnEnterValidBoardSize";
    public OnEnterValidBoardSizeEventArgs = {minValue : 0 ,maxValue : 0}

    public OnEnterInvalidBoardSize :string = "OnEnterInvalidBoardSize";

    //Open for Reference Manager to access instance.
    Init(referenceManagerInstance : ReferenceManager)
    {
        this.referenceManagerInstance = referenceManagerInstance;
    }

    onLoad(){
    
    }

    start() {
        //Listen to event
        this.generateButton.node.on('click',this.GenerateButton_OnClickGenerate,this);
        this.cancelButton.node.on('click',this.CancelButton_OnClickCancel,this);
        this.boardSettingButton.node.on('click',this.BoardSettingButton_OnClickOpen,this);

        this.HideErrorMessage();
    }

    GenerateButton_OnClickGenerate(){
        //Validation
        this.isXValueValid = this.CheckInputValidation(this.boardSizeSetting.toString());

        if(this.isXValueValid)
        {
            //Update Data
            var xValue = this.boardSizeSetting;

            //TicTacToeManager : Handle the checking logic, reset
            TicTacToeManager.instance.ResetBoardValues(new Vec2(xValue,xValue),this.matchCountSetting);
            console.log("Reset Match count into : " + this.matchCountSetting);

            //Reset Some logic that only use for BoardSettingMenu
            this.ResetBoardSetting();

            //Update Graphics
            TicTacToeSpawner.Instance.SpwanTicTacToeBoard(new Vec2(xValue,xValue));
            this.Hide();
        }
        else
        {
            this.ShowErrorMessage(this.errorMessage);
        }
    }

    CancelButton_OnClickCancel(){
        console.log("Received OnClick Cancel");
        this.ResetBoardSetting();
        this.Hide();
    }
    
    BoardSettingButton_OnClickOpen(){
        console.log("Received OnClick Open");
        this.ResetBoardSetting();
        this.Show();
    }

    public ReceiveValidBoardSize(inputBoardSize : number){
        //Change Data
        this.boardSizeSetting = inputBoardSize;

        //Fire Event
        this.OnEnterValidBoardSizeEventArgs = {minValue : this.minSize, maxValue : inputBoardSize};
        this.eventTarget.emit(this.OnEnterValidBoardSize, this.OnEnterValidBoardSizeEventArgs);
        
        //Update Feedback   
        this.HideErrorMessage();
        this.yInputUI.string = inputBoardSize.toString();

    }

    public ReceiveInvalidBoardSize(){
        this.ShowErrorMessage(this.errorMessage);
        this.eventTarget.emit(this.OnEnterInvalidBoardSize);
    }

    private ResetBoardSetting(){
        this.isXValueValid = false;
        //this.isYValueValid = false;
    }

    private Show()
    {
        this.node.active = true;
    }

    private Hide(){
        this.node.active = false;
    }

    private ShowErrorMessage(message : string){
        this.errorMessageLabel.string = message;
        this.errorMessageLabel.node.active = true;
    }

    private HideErrorMessage(){
        this.errorMessageLabel.node.active = false;
    }

    //This function will be called by the editbox event
    public CheckInputValidation(sizeString : string) : boolean{
        if(sizeString.length <= 0){
            return false;
        }
        let sizeValue = Number.parseInt(sizeString);
        if(sizeValue >= this.minSize && sizeValue <= this.maxSize)
        {
            return true;
        }
        else{
            return false;
        }
    }

    public set MatchCountSetting(newMatchCount : number){
        this.matchCountSetting = newMatchCount;
    }

    public set BoardSizeSetting(newBoardSize : number){
        this.boardSizeSetting = newBoardSize;
    }
}
