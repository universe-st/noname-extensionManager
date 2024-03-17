<script>
import {lib,game,ui,get,ai,_status} from '../../noname.js'
import {ref,onMounted, handleError} from '../../game/vue.esm-browser.js';
export default{
    setup(){
        let extensions = lib.config.extensions.slice(0);
        if (lib.config.extensionSort && Array.isArray(lib.config.extensionSort)) {
            extensions.sort((a, b) => {
			    return lib.config.extensionSort.indexOf('extension_'+a) 
                - lib.config.extensionSort.indexOf('extension_'+b);
		    });
		};
        let list = extensions.map(item=>{
            return {
                name:item,
                hide:lib.config.hiddenPlayPack.includes(`extension_${item}`),
                enable:lib.config[`extension_${item}_enable`] === true,
            };
        });
        let extensionList = ref(list);
        return {
            swapExtension:(index1,index2)=>{
                let valList = extensionList.value;
                [valList[index1],valList[index2]] = [valList[index2],valList[index1]];
                game.saveConfig('extensionSort',valList.map(item=>'extension_'+item.name));
            },
            imageDir:`${lib.assetURL}extension/扩展管家/image/`,
            handleExtensionEnable:(name,enable)=>{
                game.saveConfig(`extension_${name}_enable`,enable);
            },
            handleExtensionHide:(name,hide)=>{
                if(hide && name == '扩展管家'){
                    alert("隐藏《扩展管家》后，如您需要令其重新显示，请在控制台执行：game.saveConfig('hiddenPlayPack',[])");
                }
                if(hide){
                    lib.config.hiddenPlayPack.add(`extension_${name}`);
                }else{
                    lib.config.hiddenPlayPack.remove(`extension_${name}`);
                }
                game.saveConfig('hiddenPlayPack',lib.config.hiddenPlayPack);
            },
            extensionList
        };
    }
}

</script>

<template>
    <div id="kzgj-main-container">
        <table style="width:100%;height:100%;color:black;">
            <tr class="kzgj-table" style="height: 40px;" v-for="(extensionItem,index) in extensionList" :key="extensionItem.name">
                <td style="color:blue;">《{{ extensionItem.name }}》</td>
                <td>
                    <input type="checkbox" 
                    v-model="extensionItem.hide" 
                    @change="(val)=>handleExtensionHide(extensionItem.name,val.target.checked)"/>
                    <span @click="extensionItem.hide=!extensionItem.hide;handleExtensionHide(extensionItem.name,extensionItem.hide);">隐藏</span>
                </td>
                <td>
                    <input type="checkbox"
                    v-model="extensionItem.enable"
                    @change=""/>
                    <span @click="extensionItem.enable=!extensionItem.enable;handleExtensionEnable(extensionItem.name,extensionItem.enable)">开启</span>
                </td>
                <td>
                    <img class="kzgj-image-button" @click="swapExtension(index,index+1)" v-show="index < extensionList.length-1" width="20" height="20" :src="imageDir+'direction_down.png'"></img>
                    <img class="kzgj-image-button" @click="swapExtension(index,index-1)" v-show="index > 0" width="20" height="20" :src="imageDir+'direction_up.png'"></img>
                </td>
            </tr>
        </table>
    </div>
</template>

<style>
#kzgj-main-container{
    width: 100%;
    height: 100%;
    display: flex;
    position:absolute;
    align-items: flex-start;
    flex-direction: column;
    left: 0px;
    top: 0px;
    overflow: scroll;
}
.kzgj-table{

}
.kzgj-table>td{
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
.kzgj-image-button{
    display:inline-block;
    height: 20px;
    width: 20px;
    background-size: 100% 100%;
    background-position: center;
}
</style>