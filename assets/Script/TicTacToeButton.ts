import { _decorator, Button, Color, Component, Node, Sprite, Vec3 } from 'cc';
import { TicTacToeManager } from './TicTacToeManager';
import { ReferenceManager } from './ReferenceManager';
const { ccclass, property } = _decorator;

@ccclass('TicTacToeButton')
export class TicTacToeButton extends Component {
    private referenceManagerInstance : ReferenceManager = null;
    button : Button;
    sprite : Sprite;
    defaultSpriteColor : Color;
    isButtonClicked : boolean = false;

    @property
    buttonId : number = 0;

    Init(referenceManagerInstance : ReferenceManager){
        this.referenceManagerInstance = referenceManagerInstance;
    }

    protected onLoad(): void {
        this.button =  this.node.getComponent(Button);
        this.sprite = this.node.getComponent(Sprite);
        this.button.node.on('click',this.Button_OnButtonClick,this);
        this.defaultSpriteColor = this.sprite.color;
    }
    
    start() {
        //TicTacToeMenu not Longer hold the Button Script //TicTacToeManager.instance.TicTacToeMenu.RegisterButton(this);
        this.referenceManagerInstance.AddTicTacToeButtonInstance(this);

        
        TicTacToeManager.instance.eventTarget.on(TicTacToeManager.instance.OnPlayerPressedButton, 
            this.TicTacToeManager_OnPlayerPressedButton,this);
    }


    private TicTacToeManager_OnPlayerPressedButton(event){
        //Check if Button is this button
        if(this.buttonId != event.buttonId)
            return;
        //Udpate button Color
        this.UpdateButtonColor(event.buttonColor);
    }

    Button_OnButtonClick(){
        if(!this.isButtonClicked)
        {
            TicTacToeManager.instance.SubmitTicTacToe(this.buttonId);
            //console.info("Received COlor : " + playerColor.toString());
        }        
    }

    public DestroyButton(){
        console.log("Button INdex: " + this.buttonId + " destroyed");
        this.node.destroy();
    }

    public OnButtonReset(){
        this.isButtonClicked = false;
        this.button.interactable = true;
        this.button.disabledColor = this.defaultSpriteColor;
    }

    public UpdateButtonColor(playerColor : Color){
        this.button.interactable = false;
        this.button.disabledColor = playerColor;
        this.isButtonClicked = true;
    }

    public InitailizeButton(parentNode : Node, id : number){
        this.node.setParent(parentNode);
        this.node.position = Vec3.ZERO;

        this.buttonId = id;
    }

    public IsButtonActive(){
        return (this.isButtonClicked == false);
    }

    protected onDestroy(): void {
        //this.button.node.off('click',this.OnButtonClick,this);
    }

}


