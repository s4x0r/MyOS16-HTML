
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
                send(node.value.slice(4));
                node.value = '';
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

function genlist(){

}


function init(){
    if(localStorage.getItem('devkey')===null){
        show(devices);
        return
    }
    var wp = localStorage.getItem(localStorage.getItem('devkey')+'wp')
    if(wp===null){
        var data = JSON.parse(getFile('devices/'+localStorage.getItem('devid')+'.json'));
        wp = data['wallpapers'][0]['name'];
    }
    setWP(wp);

    show('home');
}

function switchdevice(devname, devkey, devid){
    localStorage.setItem('devkey', devkey);
    localStorage.setItem('devname', devname);
    localStorage.setItem('devid', devid);

    init();
}

function makeDevice(device){




    let dev = `
        <div class="button" onclick="switchdevice('${devname}','${devkey}')">
            <img src="img/settings_cog_gear.png"/>
            <p>${devname}</p>
        </div>
    `;
    
    
    return dev;
}

function gendevices(devices){
    const page =$("#devicepage");
    page.innerHtml="";
    devices.forEach(function(){
        page.innerHtml+="";
    });
}