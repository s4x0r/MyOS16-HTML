
window.addEventListener('message', (event) => {         
    console.log(event.data);
}, false);

$(document).ready(function() {
    $("#mycolor").colorpicker({
        defaultPalette: 'web'
    });
    
    $("#mycolor").on("change.color", function(event, color){
        send(getKey()+":color:"+color);
    });

    const node = document.getElementById('cmdbar');
    node.addEventListener("keyup", ({key}) => {
        if (key === "Enter") {
            //alert(node.value);
            if(node.value.startsWith('cmd:')){
                if(node.value.slice(4).startsWith('dev:')){
                    send(getKey()+node.value.slice(8));
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

    init();
});

function getKey(){//shorthand for getting active device key
    return localStorage.getItem(localStorage.getItem('devkey'));
}
function getKey(name){//getkey()+name
    return localStorage.getItem(localStorage.getItem('devkey')+name);
}

async function init(){//innit bruv?
    if(getKey()===null){
        show('devices');
        return;
    }
    //set wallpaper
    var wp = getKey('wp');
    if(wp===null){
        var loc = `devices/${localStorage.getItem('devid')}.json`;
        var data = await fetch(loc).then((response)=>response.json());
        //if(data['settings'].indexOf('wallpapers')==-1){show('home');return;}
        wp = data['wallpapers'][0]['name'];
    }
    setWP(wp);
    
    //set scale
    if(getKey('size')===null){
        $('#size').val(0);
    }else{
        $('#size').val(getKey('size'));
    }


    //get product data
    var data;
    if(getKey()==="<key>"){//developer mode
        data={
            "prodID":"test",
            "settings":[
                "wallpapers",
                "resize",
                "colors"
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

    //build settings page
    let out = '';
    for(let i in data['settings']){
        out +=`<p onclick="show('${i}')">${i}</p>`;
    }
    out+=`<p onclick="show('home')">Back</p>`;
    $('#settings').html(out)

    //build wallpapers page
    out='';
    for(let i in data['wallpapers']){
        out+= `<p 
            data-string="${getKey()}:util:texture:${i['key']}" 
            onclick="send(this.getAttribute('data-string')); setWP(this.innerText);">
            ${i['name']}
        </p>`;

    }
    out+= `<p 
        onclick="show(settings);">
        Back
    </p>`;
    $("#wallpapers").html(out);

    //done
    show('home');
}


function send(data){
    console.log(data)

    if(data.startsWith('dev:')){data=getKey()+data.slice(4);}

    var xhr = new XMLHttpRequest();
    xhr.open('POST', window.parent.location.href, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data); 
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
    localStorage.setItem(getKey()+'wp', wp);
}
function setSize(size){
    localStorage.setItem(getKey()+'size', size);
    send(`${getKey()}:util:resize:${Math.pow(2,this.value/100).toFixed(2)}`);
}

function genlist(list){
    var out = ''
    for(let i in list){
        out+=
        `<p data-string="${i['data']}" onclick="${i['action']}">${i['title']}</p>`;
    }
    $("#dynamiclist").html(out);
}


async function getdevices(){
    let out = '';
    const options = {
        method: 'POST',
        body: "hud:devices:get",
        headers: {
          'Content-Type': 'application/json'
        }      
      }

    var data = await fetch(window.parent.location.href, options).then((response)=>response.json());
    for(let i in data){
        out+=`
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
    out+=`
    <div class="button" onclick="show('home');">
        <img src="img/settings_cog_gear.png"/>
        <p>Back</p>
    </div>`;

    $("#devices").html(out);
    show('devices');

}


