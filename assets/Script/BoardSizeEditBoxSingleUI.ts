import { _decorator, Color, Component, EditBox, Node, Sprite } from 'cc';
import { BoardSettingMenu } from './BoardSettingMenu';
const { ccclass, property } = _decorator;

@ccclass('BoardSizeEditBoxSingleUI')
export class BoardSizeEditBoxSingleUI extends Component {
    @property(EditBox)
    public boardSizeEditBox : EditBox;

    @property(BoardSettingMenu)
    public boardSettingMenu : BoardSettingMenu;

    @property(Node)
    EditBoxOutlineNode : Node;

    protected start(): void {
         //Listen to event
        this.boardSizeEditBox.node.on('editing-did-ended', this.EditBox_OnEndEdit, this);
        this.HideOutline();
    }

    public UpdateInputUI(isValid : boolean){
        if(isValid)
        {
            this.ShowOutline(Color.GREEN);
        }
        else{
            this.ShowOutline(Color.RED);
        }
    }

    public RetriveString() : string{
        return this.boardSizeEditBox.string;
    }

    private ShowOutline(spriteColor : Color)
    {
        this.EditBoxOutlineNode.getComponent(Sprite).color = spriteColor;
        this.EditBoxOutlineNode.active = true;
    }

    private HideOutline(){
        this.EditBoxOutlineNode.active = false;
    }

    private EditBox_OnEndEdit(editbox: EditBox){
        if(editbox != this.boardSizeEditBox){
            console.error("Invalid EdixBox event called, this should be not happen");
            return;
        }

        //Check Input
        var isValidInput = this.boardSettingMenu.CheckInputValidation(this.RetriveString());
        this.UpdateInputUI(isValidInput);
        if(isValidInput){
            var inputBoardSize = Number.parseInt(this.RetriveString());

            this.boardSettingMenu.ReceiveValidBoardSize(inputBoardSize);
        }          
        else
        {
            console.log("Detected Invalid Board Size");
            this.boardSettingMenu.ReceiveInvalidBoardSize();
        }
    }
}


