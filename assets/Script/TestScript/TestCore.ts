import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { TestChild } from './TestChild';
import { TestChild2 } from './TestChild2';

@ccclass('TestCore')
export class TestCore extends Component {
    public static instance : TestCore;

    @property(TestChild)
    private readonly testChildInstance : TestChild;

    // @property(Array<TestChild2>)
    // private readonly testChild2Instance : Array<TestChild2>;

    @property(TestChild2)
    private testChild2Instance : TestChild2;

    @property(Node)
    childNode : Node;
    
    protected onLoad(): void {
        if(TestCore.instance !=null && TestCore.instance != this)
        {
            this.node.destroy()
        }else
        {
            TestCore.instance = this;
        }

        this.testChildInstance.Init(this,this.childNode);

    //    this.testChild2Instance.forEach(testChild2Instance => {
    //     testChild2Instance.Init(this);
    //    });
    }

    start() {
        
    }

    public SomePublicFunction_TestCore(){

    }

    get TestChildInstance(){
        return this.testChildInstance;
    }

    get TestChild2Instance(){
        return this.testChild2Instance;
    }

    set TestChild2Instance(testChild2 : TestChild2){
        this.testChild2Instance = testChild2;
        this.testChild2Instance.Init(this);
    }

}


