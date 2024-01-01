import { _decorator, Component, Label, Node } from 'cc';
import { TestCore } from './TestCore';
const { ccclass, property } = _decorator;


@ccclass('TestChild')
export class TestChild extends Component {
    private testCoreInstance : TestCore = null;

    @property(Node)
    childDummyNode : Node;

    @property(Label)
    childLabel : Label;

    public child : Child = new Child({childString : "Hi, I am Child 1", childNumber : 10});

    Init(testCoreInstance : TestCore, childNode : Node){
        this.testCoreInstance = testCoreInstance;
        //this.childDummyNode = childNode;
    }

    SomeTestFunction_TestChild(callerName : string){
        console.log("Hello, I am Test Child 1 and I am called from " + callerName);
    }

    ShowDummyNode(message : string){
        this.childDummyNode.active = true;
        this.childLabel.string  = message;
    }

    GetChildDetail() {
        return this.child;
    }
}

export interface MyChildConfig {
    childString?: string;
    childNumber: number;
}

@ccclass('Child')
export class Child{
    public childString : string = "";

    public childNumber : number = 0;

    constructor (config: MyChildConfig) {
        ({ childString: this.childString, childNumber: this.childNumber } = config);
    } 
}
