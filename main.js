import {lib,game,ui,get,ai,_status} from '../../noname.js'
import {createApp, onMounted,ref, handleError} from '../../game/vue.esm-browser.js';
import { Task,GroupTask } from './lib/task.js';
import App from './board.vue';

function getFileList(path){
    return new Promise((resolve,reject)=>{
        game.getFileList(path,(folders,files)=>{
            resolve([folders,files]);
        },reject);
    });
}

class FileDeleteTask extends Task{
    constructor(parent,path){
        super(parent);
        this.path = path;
    }

    taskContent(){
        return game.promises.removeFile(this.path);
    }
}

class DirDeleteTask extends GroupTask{
    constructor(parent,path){
        super(parent);
        this.path = path;
    }

    getChildren(){
        return getFileList(this.path)
        .then((ret)=>{
            let [folders,files] = ret;
            this.children = [];
            folders.forEach(folder=>this.children.push(new DirDeleteTask(this,`${this.path}/${folder}`)));
            files.forEach(file=>this.children.push(new FileDeleteTask(this,`${this.path}/${file}`)));
        }).catch((e)=>{
            this.callTaskListener('failure',e);
        });
    }

    // onAllChildrenDone(){
    //     return (new FileDeleteTask(null,this.path)).doTask();
    // }
}

export async function checkExtensionFileExist(name){
    let [folders,files] = await getFileList(`extension`);
    return folders.includes(name);
}
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

export function clearExtensionConfig(name){
    lib.config.extensions.remove(name);
    game.saveConfig('extensions',lib.config.extensions);
    game.removeExtension(name);
}
export function removeExtension(name){
    return new Promise((resolve,reject)=>{
        let back = ui.create.div('.kzgj-main-window-back-progress');
        let inner = ui.create.div('.kzgj-main-window-progress',back);
        document.body.appendChild(back);
        let done = function(){
            clearExtensionConfig(name);
            alert(`《${name}》已成功删除`);
            back.delete();
            resolve();
        };
        let onFail = function(){
            alert(`无法删除扩展。`);
            back.delete();
            resolve();
        };
        createApp({
            setup(){
                let progress = ref(0);
                let text = ref(`正在删除扩展《${name}》`);
                onMounted(async ()=>{
                    if(!await checkExtensionFileExist(name)){
                        alert(`未找到扩展《${name}》的文件，将直接删除配置。`);
                        done();return;
                    }
                    let task = new DirDeleteTask(null,`extension/${name}`);
                    task.progressListeners.push((p)=>{
                        progress.value = p;
                    });
                    task.taskListeners.push((e,err)=>{
                        if(e == 'done'){
                            done();
                        }else if(e == 'failure'){
                            onFail();
                        }else if(e == 'error'){
                            console.log(err);
                        }
                    });
                    task.doTask();
                });
                return {progress,text};
            },
            template:`<div style='display:block;color:white;font-size:25px;'>
            {{text}}
            <br><br>
            <span>进度{{progress.toFixed(2) * 100}}%</span>
            </div>`,
        })
        .mount(inner);
    });
}