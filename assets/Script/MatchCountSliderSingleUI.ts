import { _decorator, Component, Label, lerp, Node, Slider ,EventTarget } from 'cc';
import { BoardSettingMenu } from './BoardSettingMenu';

const { ccclass, property } = _decorator;

//const eventTarget = new EventTarget();

@ccclass('MatchCountSliderSingleUI')
export class MatchCountSliderSingleUI extends Component {
    @property(Slider)
    matchCountSlider : Slider;

    @property(Label)
    minLabel : Label;

    @property(Label)
    maxLabel : Label;

    @property(Node)
    matchCountOptionBlocker : Node;

    @property(BoardSettingMenu)
    boardSettingMenu : BoardSettingMenu;

    private inputMatchCount = 3;
    public minMatchCount = 0;
    public maxMatchCount = 0;

    protected onLoad(): void {
        console.info("Subscribe to slider eveet");
        
        
        const sliderEventHandler = new MatchCountSliderSingleUI.EventHandler();
        // This Node is the node to which your event processing script component belongs
        sliderEventHandler.target = this.node;
        // This is the script class name
        sliderEventHandler.component = 'MatchCountSliderSingleUI';
        sliderEventHandler.handler = 'OnSlide';
        
        //this.matchCountSlider.node.on('slide', this.onSlide, this);
        
        this.matchCountSlider!.slideEvents.push(sliderEventHandler);
    }

    start() {   
        this.boardSettingMenu.eventTarget.on(this.boardSettingMenu.OnEnterValidBoardSize,(event) => {
            var sampleString = "Recived Event, MAX : " + event.maxValue + " MIN : " + event.minValue;
            console.info(sampleString);
            this.UpdateMinMaxIcon(event.minValue,event.maxValue);
            this.boardSettingMenu.MatchCountSetting = this.inputMatchCount;
            this.Show();
          }); 
        
        this.boardSettingMenu.eventTarget.on(this.boardSettingMenu.OnEnterInvalidBoardSize,()=>{
            console.log("Close MatchCOunt OPtion");
            this.Hide();
            this.minMatchCount = 0;
            this.maxMatchCount = 0;
            this.inputMatchCount = 3;
        })
        this.Hide();
    }

    public UpdateMinMaxIcon (minValue : number, maxValue : number){
        this.minLabel.string = minValue.toString();
        this.maxLabel.string = maxValue.toString();

        this.minMatchCount = minValue;
        this.maxMatchCount = maxValue;

        this.matchCountSlider.progress = 0;
        this.inputMatchCount = 3;
    }

    Show(){
        this.matchCountOptionBlocker.active = false;
    }

    Hide(){
        this.matchCountOptionBlocker.active = true;
    }
    
    OnSlide (slider: Slider) {
        // Get the current progress of the slider
        let progress = slider.progress;

        var numOfOption = this.maxMatchCount - this.minMatchCount;
        if(numOfOption <= 0 ){
            numOfOption = 1;
        }
        // Round the progress to the nearest 0.5
        progress = Math.round(progress * numOfOption) / numOfOption;
        // Set the progress of the slider to 0, 0.5, or 1
        slider.progress = progress;
        // Do something with the progress value
        this.CalculateMatchCount(progress);
        this.boardSettingMenu.MatchCountSetting = this.inputMatchCount;
    }

    private CalculateMatchCount(progress : number){
        this.inputMatchCount = Math.round(lerp(this.minMatchCount,this.maxMatchCount,progress));
        console.info("Current Progress : " + progress + ", convert to match Count : " + this.inputMatchCount);
    }
}


