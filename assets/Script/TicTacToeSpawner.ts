import { _decorator, Component, instantiate, Layout, Node, Prefab, Size, UITransform, Vec2, Vec3 } from 'cc';
import { TicTacToeButton } from './TicTacToeButton';
import { ReferenceManager } from './ReferenceManager';
const { ccclass, property } = _decorator;

@ccclass('TicTacToeSpawner')
export class TicTacToeSpawner extends Component {
    private referenceManagerInstance : ReferenceManager = null;

    @property(Node)
    parentNode : Node;

    @property(Prefab)
    ticTaeToePrefab : Prefab;

    @property(Layout)
    gridLayout : Layout;
    
    Init(referenceManagerInstance : ReferenceManager){
        this.referenceManagerInstance = referenceManagerInstance;
    }

    protected onLoad(): void {
        // if(TicTacToeSpawner.Instance !=null && TicTacToeSpawner.Instance != this)
        // {
        //     this.node.destroy()
        // }else
        // {
        //     TicTacToeSpawner.Instance = this;
        // }
    }

    start() {

    }

    public SpwanTicTacToeBoard(boardSize : Vec2)
    {
        //this.UpdateTicTacToeButton(boardSize);
        //Destroy All button
        this.ClearBoard();

        //Spawn New Board
        this.AdjustGridLayout(boardSize);

        //Spawn New Button
        var spawnAmount = boardSize.x * boardSize.y;
        this.GenerateBoard(spawnAmount);
    }

    private UpdateTicTacToeButton(newBoardSize : Vec2){
        //Check how much need to be add or need to be remove (Exist - target ,-neg = need to add, +pos = need to remove)
        var existingButtonCount = this.referenceManagerInstance.TicTacToeManagerInstance.BoardSize.x * this.referenceManagerInstance.TicTacToeManagerInstance.BoardSize.y;
        var newBoardButtonCount = newBoardSize.x* newBoardSize.y;
        var updateButtonCount = existingButtonCount - newBoardButtonCount;

        var ticTacToeButtons = this.referenceManagerInstance.TicTacToeButtonInstances;
        if(updateButtonCount > 0)
        {
            console.log("Need to remove Button");
            for(let i = ticTacToeButtons.length - 1; i <= 0; i--){
                var buttonId = ticTacToeButtons[i].buttonId;
                console.log("Removing Button : " + buttonId + " from list");
                //this.referenceManagerInstance.TicTacToeButtonInstances.splice(i,1);
            }
        }
        else if(updateButtonCount < 0)
        {
            console.log("Need to add button");
            for(let i = ticTacToeButtons.length; i < newBoardButtonCount; i++){
                
                console.log("Add Button with id : " + (i-1));
            }
        }
        else{
            console.log("Same Board Size, no need update tictactoe button");
        }

        //Sorting ned ?

        //Make sure the only remove from last element of the array to ensure the button index is in ascending

        //Make sure the added button is match with the last existing button

    }

    private ClearBoard(){
        if(this.parentNode.children.length == 0)
        {
            console.error("Clear Board while the board is empty this should not be happen, except the first time reset");
            return;
        }

        //console.info("TicTacToe list count before clear : " + this.referenceManagerInstance.TicTacToeButtonInstances.length);

        //Get Buttons scripts from the reference manager, iterate the array and call the slice one by one button script
        var ticTacToeButtons = this.referenceManagerInstance.TicTacToeButtonInstances;

        for(let i = ticTacToeButtons.length - 1; i >= 0; i--)
        {
            //console.log("Current Index is : " + i);
            var tempTicTacToeButton = this.referenceManagerInstance.TicTacToeButtonInstances[i];
            //this.referenceManagerInstance.RemoveTicTacToeButtonInstance(tempTicTacToeButton);
            this.referenceManagerInstance.TicTacToeButtonInstances.splice(i,1);
            tempTicTacToeButton.DestroyButton();
        }

       // console.info("TicTacToe list counnt after clear : " + this.referenceManagerInstance.TicTacToeButtonInstances.length);

    }
    
    private AdjustGridLayout(boardSize : Vec2){
        //Adjust Layout
        this.gridLayout.constraintNum = boardSize.x;

        //Adjust Cell Size
        var referenceCellCount =  Math.max(boardSize.x,boardSize.y);
        var gridLayoutSize = this.gridLayout.node.getComponent(UITransform).contentSize.x;
        var cellSize = (gridLayoutSize - this.gridLayout.paddingLeft - this.gridLayout.paddingRight
             - (this.gridLayout.spacingX * (referenceCellCount - 1))) / referenceCellCount
        this.gridLayout.cellSize = new Size(cellSize,cellSize);
    }
    
    //Instantiate can be done insde Button Class with static function.
    private GenerateBoard(spawnAmount : number){
        for(let i =0;i< spawnAmount; i++){
            //Spwan prefabs
            var spawnedTicTacToeButton = instantiate(this.ticTaeToePrefab).getComponent(TicTacToeButton);
            spawnedTicTacToeButton.Init(this.referenceManagerInstance);
            spawnedTicTacToeButton.InitailizeParentNode(this.parentNode,i);
        }
    }
}


