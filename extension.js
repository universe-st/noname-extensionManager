import {lib,game,ui,get,ai,_status} from '../../noname.js'
import {content} from './source/content.js'
import {precontent} from './source/precontent.js'
import {config} from './source/config.js'
import {help} from './source/help.js'
import {basic} from './source/basic.js'

export let type = 'extension';

export default async function(){
    const extensionInfo = 
        await lib.init.promises.json(`${basic.extensionDirectoryPath}info.json`);
    let extension = {
        name:extensionInfo.name,
        content:content,
        precontent:precontent,
        config:await basic.resolve(config),
        help:await basic.resolve(help),
        package:{},
        files:{"character":[],"card":[],"skill":[],"audio":[]}
    };
    extensionInfo.intro += `<br><br>关注《无名杀扩展交流》公众号，获取更多扩展信息。<img style='width:238px' src='${basic.extensionDirectoryPath}image/gzh.jpg'/>`;
    Object.keys(extensionInfo)
    .filter(key=>key!='name')
    .forEach(key=>extension.package[key]=extensionInfo[key]);
    return extension;    
}
