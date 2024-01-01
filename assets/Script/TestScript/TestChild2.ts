import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { TestCore } from './TestCore';

@ccclass('TestChild2')
export class TestChild2 extends Component {
    private testCoreInstance : TestCore = null;

    Init(testCoreInstance : TestCore){
        this.testCoreInstance = testCoreInstance;
    }

    protected start(): void {

        this.SomeTestFunction_TestChild2();
    }

    SomeTestFunction_TestChild2(){
        this.testCoreInstance.TestChildInstance.SomeTestFunction_TestChild(this.name);
        var child = this.testCoreInstance.TestChildInstance.GetChildDetail();
        this.testCoreInstance.TestChildInstance.ShowDummyNode(child.childString + child.childNumber);
    }
}


