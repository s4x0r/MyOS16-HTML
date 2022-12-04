var hudURL;

function getPromiseFromEvent(item, event) {
    return new Promise((resolve) => {
      const listener = (e) => {
        item.removeEventListener(event, listener);
        resolve(e.data);
      }
      item.addEventListener(event, listener);
    })
  }


window.addEventListener('message', (event) => {         
    console.log(event.data);
    //hudURL=event.data;
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
    send('hud:ready');
    init();
});

function makeApp(name, icon, action){
    return `
    <div class="button dynamic" 
        onclick="${action}"
    >
        <img src="img/icon/${icon}"/>
        <p>${name}</p>
    </div>`;
}

async function init(){//innit bruv?
    console.log(localStorage)
    console.log(localStorage.getItem('devkey'));
    if(localStorage.getItem('devkey')===null){
        show('devices');
        return;
    }


    //get product data
    var data;
    if(localStorage.getItem('devkey')==="<key>"){//developer mode
        data={
            "prodID":"test",
            "apps":[
                {"name":"Wallpapers",
                "icon":"",
                "action":"show('wallpapers');"
                },
                {"name":"Resize",
                "icon":"",
                "action":"show('resize');"
                },
                {"name":"Colors",
                "icon":"",
                "action":"show('colors');"
                }
            ],
            "wallpapers":[
                {"name":"14WP-1","key":"d5c57d25-9f9c-c99e-8007-aee26d5832cd"},
                {"name":"14WP-2","key":"01583bba-793c-137c-f992-71096887efa2"}
            ]
        };
    }else{
        var loc = `devices/${localStorage.getItem('devid')}.json`
        data = await fetch(loc).then((response)=>response.json());
    }
    console.log(data);
    //set wallpaper
    var wp = localStorage.getItem(localStorage.getItem('devkey')+'wp');
    if(wp===null){
        var loc = `devices/${localStorage.getItem('devid')}.json`;
        var data = await fetch(loc).then((response)=>response.json());
        //if(data['settings'].indexOf('wallpapers')==-1){show('home');return;}
        wp = data.wallpapers[0].name;
    }
    setWP(wp);

    //make apps
    $("#home .dynamic").remove();
    for(i in data.apps){
        $("#home").append(makeApp(data[i].name, data[i].icon, data[i].action));
    }
    
    
    //set scale
    if(localStorage.getItem('devkey')+'size'===null){
        $('#size').val(0);
    }else{
        $('#size').val(localStorage.getItem('devkey')+'size');
    }


    //build wallpapers page
    $("#wallpapers .dynamic").remove();
    for(let i in data.wallpapers){
        $("#wallpapers").append(`<p class="dynamic"
            onclick="send("dev:util:texture:${data[i].key}"); setWP(this.innerText);">
            ${data[i].name}
        </p>`);
    }

    //done
    show('home');
}


function send(data){
    console.log(data)

    if(data.startsWith('dev:')){data=localStorage.getItem('devkey')+data.slice(4);}
    window.parent.postMessage(data, "*");
    /*
    var xhr = new XMLHttpRequest();
    xhr.open('POST', hudURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);
    */ 
}


function show(display){
    for(let i = 0; i<document.getElementsByClassName('screen').length; i++){
        document.getElementsByClassName('screen')[i].style.display='none';
        }
    document.getElementById(display).style.display='';
}

function setWP(wp){
    var r = document.querySelector(':root');
    r.style.setProperty('--bg', 'url("img/wp/'+wp+'.png")');
    localStorage.setItem(localStorage.getItem('devkey')+'wp', wp);
}
function setSize(size){
    localStorage.setItem(localStorage.getItem('devkey')+'size', size);
    send(`${localStorage.getItem('devkey')}:util:resize:${Math.pow(2,this.value/100).toFixed(2)}`);
}


async function getDevices(){
    $("#deviceContainer .button").remove();

    send('hud:devices:get');
    var data = JSON.parse(await getPromiseFromEvent(window, 'message'));
    console.log(data);
    //var data = await fetch(hudURL, options).then((response)=>response.json());
    for(let i in data){
        //console.log(i);
        $("#deviceContainer").append(makeApp(
            data[i].name,
            "tablet_smart_phone.png",
            `localStorage.setItem('devkey', '${data[i].key}');
                localStorage.setItem('devname', '${data[i].name}');
                localStorage.setItem('devid', '${data[i].id}');
                init();
            `
        ));
    }

    show('devices');
}


