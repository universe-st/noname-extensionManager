export class Task{
    constructor(parent){
        this.parent = parent;
        this.doing = false;
        this.done = false;
        this.progressListeners = [];
        this.taskListeners = [];
    }

    doTask(){
        this.doing = true;
        this.updateProgress();
        return Promise.resolve(this.taskContent());
    }

    getProgress(){
        return this.progress ? this.progress:0;
    }

    updateProgress(){
        this.progressListeners.forEach(listener=>listener(this.getProgress()));
        if(this.parent){
            this.parent.updateProgress();
        }
    }

    callTaskListener(event,params){
        this.taskListeners.forEach(listener=>listener(event,params));
    }

    doneTask(){
        this.progress = 1;
        this.done = true;
        this.updateProgress();
        if(this.parent && (this.parent instanceof GroupTask)){
            this.parent.onChildDone();
        }
        this.callTaskListener('done');
    }

    taskContent(){

    }
}

export class GroupTask extends Task{
    constructor(parent){
        super(parent);
        this.children = [];
    }

    getChildren(){
        return new Promise((resolve)=>{
            this.children = [];
            resolve();
        });
    }

    getProgress(){
        if(!this.children || this.children.length == 0)return 0;
        return this.children.reduce((previous,current)=>{
            return previous+current.getProgress();
        },0)/this.children.length;
    }

    taskContent(){
        this.getChildren()
        .then(()=>{
            return Promise.all(this.children.map(child=>child.doTask().catch((e)=>{
                this.callTaskListener('error',e);
                console.log(e);
            }).then(()=>{
                return Promise.resolve(this.onChildDone());
            })));
        })
        .then(()=>{
            return Promise.resolve(this.onAllChildrenDone());
        })
        .then(()=>{
            this.doneTask();
        })
        .catch(e=>{
            alert(e);
            this.callTaskListener('failure',e);
        });
    }

    onAllChildrenDone(){

    }

    onChildDone(){

    }

}