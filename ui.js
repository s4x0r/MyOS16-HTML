
window.addEventListener('message', (event) => {         
    console.log(event.data);
}, false);

$(document).ready(function() {
    $("#mycolor").colorpicker({
        defaultPalette: 'web'
    });
    
    $("#mycolor").on("change.color", function(event, color){
        send(localStorage.getItem('devkey')+":color:"+color);
    });

    const node = document.getElementById('cmdbar');
    node.addEventListener("keyup", ({key}) => {
        if (key === "Enter") {
            //alert(node.value);
            if(node.value.startsWith('cmd:')){
                if(node.value.slice(4).startsWith('dev:')){
                    send(localStorage.getItem('devid')+node.value.slice(8));
                    node.value = '';
                }else{
                    send(node.value.slice(4));
                    node.value = '';
                }
            }else{
                window.parent.location.href="https://www.google.com/search?q="+encodeURIComponent(node.value);
            }
            //send(node.value);
            
        }   
    });

    show('home');
});

function send(data){
    //window.parent.postMessage(data, '*');
    //document.getElementById('display').innerText=data;
    console.log(data)


    var xhr = new XMLHttpRequest();
    xhr.open('POST', window.parent.location.href, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data); 
    
}

function send(data, callback){
    console.log(data)
    var xhr = new XMLHttpRequest();
    xhr.onload=function(){
        console.log(xhr.responseText)
        callback(xhr.responseText)
    }
    xhr.open('POST', window.parent.location.href, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data); 
    
}

function get(location, callback){
    //console.log(data)
    var xhr = new XMLHttpRequest();
    xhr.onload=function(){
        console.log(xhr.responseText)
        callback(xhr.responseText)
    }
    xhr.open('GET', location, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.get(); 
    
}

async function getFile(location) {
    let myPromise = new Promise(function(resolve) {
      let req = new XMLHttpRequest();
      req.open('GET', location);
      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          resolve("File not Found");
        }
      };
      req.send();
    });
    return await myPromise;
  }

function show(display){
    for(let i = 0; i<document.getElementsByClassName('screen').length; i++){
        document.getElementsByClassName('screen')[i].style.display='none';
        }
    //document.getElementById('home').style.display='none';
    //document.getElementById('settings').style.display='none';

    document.getElementById(display).style.display='';
}

function setWP(wp){
    var r = document.querySelector(':root');
    r.style.setProperty('--bg', 'url("img/wp/'+wp+'.png")');
    localStorage.setItem(localStorage.getItem('devkey')+'wp', wp);
}

function genlist(list){
    $("#dynamiclist").innerHtml='';
    for(let i in list){
        $('#dynamiclist').innerHtml+=
        `<p data-string="${i['data']}" onclick="${i['action']}">${i['title']}</p>`;
    }
}


async function getwp(){
    var loc = `devices/${localStorage.getItem('devid')}.json`
    var data = await fetch(loc).then((response)=>response.json());

    var list=[];
    for(let i in data['wallpapers']){
        list+=[{
            'title':i['name'],
            'data':`${localStorage.getItem('devkey')}:util:texture:${i['key']}`, 
            'action':"send(this.getAttribute('data-string')); setWP(this.innerText);"
        }];
    }
    list+=[{
        'title':'Back',
        'data':'', 
        'action':"show('settings');"
    }];
    genlist(list);
    show('dynamiclist');
}

async function getdevices(){
    const page =$("#devices");
    page.innerHtml=";"
    const options = {
        method: 'POST',
        body: "hud:devices:get",
        headers: {
          'Content-Type': 'application/json'
        }
      }

    var data = await fetch(window.parent.location.href, options).then((response)=>response.json());
    for(let i in data){
        page.innerHtml+=`
        <div class="button" 
            onclick="localStorage.setItem('devkey', ${i['key']});
                localStorage.setItem('devname', ${i['name']});
                localStorage.setItem('devid', ${i['id']});
                init();"
        >
            <img src="img/settings_cog_gear.png"/>
            <p>${i['name']}</p>
        </div>`;
    }
    page.innerHtml+=`
    <div class="button" onclick="show('home');">
        <img src="img/settings_cog_gear.png"/>
        <p>Back</p>
    </div>`;
    show('devices');

}

async function init(){
    if(localStorage.getItem('devkey')===null){
        show(devices);
        return
    }
    var wp = localStorage.getItem(localStorage.getItem('devkey')+'wp')
    if(wp===null){
        var loc = `devices/${localStorage.getItem('devid')}.json`
        var data = await fetch(loc).then((response)=>response.json());
        if(data['settings'].indexOf('wallpapers')==-1){show('home');return;}
        wp = data['wallpapers'][0]['name'];
    }
    setWP(wp);

    show('home');
}

