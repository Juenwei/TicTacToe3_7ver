import { _decorator, Button, Color, Component, Node, Sprite, Vec3 } from 'cc';
import { TicTacToeManager } from './TicTacToeManager';
import { ReferenceManager } from './ReferenceManager';
const { ccclass, property } = _decorator;

@ccclass('TicTacToeButton')
export class TicTacToeButton extends Component {
    private referenceManagerInstance : ReferenceManager = null;
    button : Button;
    buttonColorSprite : Sprite;
    defaultSpriteColor : Color;
    isButtonClicked : boolean = false;

    @property
    buttonId : number = 0;

    //Reference Manager reference Add
    Init(referenceManagerInstance : ReferenceManager){
        this.referenceManagerInstance = referenceManagerInstance;
    }

    protected onLoad(): void {
        this.button =  this.node.getComponent(Button);
        this.buttonColorSprite = this.node.getComponent(Sprite);
        this.button.node.on('click',this.Button_OnButtonClick,this);
        this.defaultSpriteColor = this.buttonColorSprite.color;
    }
    
    start() {
        //Due to the button is instantiated so we need to use singetlon to do acces the Reference manager instance.
        ReferenceManager.Instance.AddTicTacToeButtonInstance(this);

        this.referenceManagerInstance.TicTacToeManagerInstance.eventTarget.on(
            this.referenceManagerInstance.TicTacToeManagerInstance.OnPlayerPressedButton, 
            this.TicTacToeManager_OnPlayerPressedButton,this);

        // TicTacToeManager.instance.eventTarget.on(TicTacToeManager.instance.OnPlayerPressedButton, 
        //     this.TicTacToeManager_OnPlayerPressedButton,this);
    }

    private TicTacToeManager_OnPlayerPressedButton(event){
        //Check if Button is this button
        if(this.buttonId != event.buttonId)
            return;
        //Udpate button Color
        this.UpdateButtonColor(event.buttonColor);
    }

    private Button_OnButtonClick(){
        if(!this.isButtonClicked)
        {
            this.referenceManagerInstance.TicTacToeManagerInstance.SubmitTicTacToe(this.buttonId);
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

    public InitailizeParentNode(parentNode : Node, id : number){
        this.node.setParent(parentNode);
        this.node.position = Vec3.ZERO;

        this.buttonId = id;
    }

    public IsButtonActive(){
        return (this.isButtonClicked == false);
    }

    protected onDestroy(): void {
        this.referenceManagerInstance.TicTacToeManagerInstance.eventTarget.off(
            this.referenceManagerInstance.TicTacToeManagerInstance.OnPlayerPressedButton, 
            this.TicTacToeManager_OnPlayerPressedButton,this);
    }

}


