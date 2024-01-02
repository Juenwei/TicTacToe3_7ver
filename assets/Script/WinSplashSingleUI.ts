import { _decorator, Button, Component, Node, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WinSplashSingleUI')
export class WinSplashSingleUI extends Component {
    
    @property(RichText)
    winMessageText : RichText;
    
    @property(Button)
    closeButton : Button;

    protected onLoad(): void {
        this.closeButton.node.on('click',this.Hide,this);
    }

    start() {

        this.Hide();
    }


    //Public Method
    public SetResultMessage(messageString : string){
        this.winMessageText.string = messageString;
        this.Show();
    }

    //Private Method
    private Show()
    {
        this.node.active = true;
    }

    private Hide(){
        this.node.active = false;
    }

}


