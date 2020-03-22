import ScrollList from "../../CustomUI/ScrollList";
import Panel from "../../CocosFrame/Panel";
import EmojiItem from "./EmojiItem";
import { DB } from "../../CocosFrame/DataBind";


const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/EmojiPanel")
export default class EmojiPanel extends Panel {

    @property(cc.Button)
    okBtn: cc.Button = null;

    @property(ScrollList)
    scrollList: ScrollList = null;

    @property(EmojiItem)
    emojiItem1:EmojiItem = null;

    @property(EmojiItem)
    emojiItem2:EmojiItem = null;

    private dataList = [{id:0},
        {id:1},
        {id:2},
        {id:3},
        {id:4},
        {id:5},
        {id:6},
        {id:7},
        {id:8},
        {id:9},
    ]
    private selectingIdx = 1;
    onLoad () {
        super.onLoad();
        this.okBtn.node.on("click", this.onOkBtnTap, this);
        this.scrollList.setDataArr(this.dataList);
        this.Bind("user/emoji1",(id)=>{
            let data = this.dataList.find((data)=>{
                return data.id == id;
            });
            this.emojiItem1.setData(data);
        });
        this.Bind("user/emoji2",(id)=>{
            let data = this.dataList.find((data,)=>{
                return data.id == id;
            });
            this.emojiItem2.setData(data);
        });
        this.emojiItem1.node.on("click", this.onEmoji1Tap, this);
        this.emojiItem2.node.on("click", this.onEmoji2Tap, this);
        this.scrollList.node.on(ScrollList.SELECT_CHILD, this.onSelectChild, this);
        this.onEmoji1Tap();
    }
    onEmoji1Tap(){
        this.selectEmoji(1);
        let id = DB.Get("user/emoji1");
        if(id != null){
            let data = this.dataList.find((data)=>{
                return data.id == id;
            });
            this.scrollList.selectItemByData(data, false);
        }else{
            this.scrollList.selectItemByData(null);
        }        
    }
    onEmoji2Tap(){
        this.selectEmoji(2);
        let id = DB.Get("user/emoji2");
        if(id != null){
            let data = this.dataList.find((data)=>{
                return data.id == id;
            });
            this.scrollList.selectItemByData(data, false);
        }else{
            this.scrollList.selectItemByData(null);
        }   
    }
    selectEmoji(idx){
        this.selectingIdx = idx;
        this.emojiItem1.stateChange(idx == 1);
        this.emojiItem2.stateChange(idx == 2);
    }
    onSelectChild(item, data){
        if(this.selectingIdx == 1){
            DB.Set("user/emoji1", data.id);
        }else if(this.selectingIdx == 2){
            DB.Set("user/emoji2", data.id);
        }
    }
    onOkBtnTap(){
        this.panelStack.PopCurrent();
    }
}
