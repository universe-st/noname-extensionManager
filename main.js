import {lib,game,ui,get,ai,_status} from '../../noname.js'
import {createApp} from '../../game/vue.esm-browser.js';
import App from './board.vue';
export function openExtensionManagerBoard(){
    if(!lib.config.kzgj_mentioned){
        alert("此面板的设置均有在重启后才能生效。");
        game.saveConfig('kzgj_mentioned',true);
    }
    let app = createApp(App);
    let back = ui.create.div('.kzgj-main-window-back');
    let inner = ui.create.div('.kzgj-main-window-center',back);
    inner.listen((e)=>{
        e.stopPropagation();
    });
    back.listen(()=>{
        back.delete();
    });
    document.body.appendChild(back);
    app.mount(inner);
}