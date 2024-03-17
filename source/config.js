import {lib,game,ui,get,ai,_status} from '../../../noname.js'
import { openExtensionManagerBoard } from '../main.js'
export const config = {
    "manager":{
        "name":"<span style='color:blue;border:1px solid blue;border-radius:5px;padding:5px;'>打开管理面板☜</span>",
        "clear":true,
        "onclick":function(){
            openExtensionManagerBoard();
        }
    }
}