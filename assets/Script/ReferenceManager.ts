import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

import { BoardSettingMenu } from './BoardSettingMenu';
import { TicTacToeMenu } from './TicTacToeMenu';
import { TicTacToeButton } from './TicTacToeButton';
import { TicTacToeManager } from './TicTacToeManager';
import { TicTacToeSpawner } from './TicTacToeSpawner';

@ccclass('ReferenceManager')
export class ReferenceManager extends Component {
    public static Instance : ReferenceManager;

    //Reference Property
    @property(BoardSettingMenu)
    private boardSettingMenuInstance : BoardSettingMenu;

    @property(TicTacToeMenu)
    private ticTacToeMenuInstance : TicTacToeMenu;

    private ticTacToeButtonInstances : Array<TicTacToeButton> = new Array<TicTacToeButton>();

    @property(TicTacToeManager)
    private ticTacToeManagerInstance : TicTacToeManager;

    @property(TicTacToeSpawner)
    private ticTacToeSpawnerInstance : TicTacToeSpawner;

    // Function
    protected onLoad(): void {
        //Singetlon
        if(ReferenceManager.Instance != null && ReferenceManager.Instance != this){
            this.node.destroy();
        } 
        else{
            ReferenceManager.Instance = this;
        }

        //Init
        this.boardSettingMenuInstance.Init(this);

        this.ticTacToeMenuInstance.Init(this);

        this.ticTacToeManagerInstance.Init(this);

        this.ticTacToeSpawnerInstance.Init(this);
    }

    start() {
        
    }

    public AddTicTacToeButtonInstance(ticTacToeButton : TicTacToeButton){
        if(this.ticTacToeButtonInstances.some((buttonItem) => buttonItem.buttonId == ticTacToeButton.buttonId)){
            console.error("Same Tic Tac Toe Button Added to the reference Manager, this should be not happen");
            return;
        }

        console.info("Registered Button");
        //ticTacToeButton.RegisterSelfButton(this.TicTacToeButtonInstances);
        this.ticTacToeButtonInstances.push(ticTacToeButton);
        ticTacToeButton.Init(this);
    }

    // GETTER SETTER
    get BoardSettingMenuInstance(){
        return this.boardSettingMenuInstance;
    }

    get TicTacToeMenuInstance(){
        if(this.ticTacToeButtonInstances == null)
        {
            console.log("TicTacToe is null;");
        }
        return this.ticTacToeMenuInstance;
    }

    get TicTacToeButtonInstances(){
        return this.ticTacToeButtonInstances;
    }

    get TicTacToeManagerInstance(){
        return this.ticTacToeManagerInstance;
    }

    get TicTacToeSpawnerInstance(){
        return this.ticTacToeSpawnerInstance
    }
}