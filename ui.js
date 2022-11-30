
window.addEventListener('message', (event) => {         
    console.log(event.data);
}, false);

$(document).ready(function() {
    $("#mycolor").colorpicker({
        defaultPalette: 'web'
    });
    
    $("#mycolor").on("change.color", function(event, color){
        send("color:"+color);
    });

    const node = $("#cmdbar");
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
    })

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

function get(data, callback){
    console.log(data)
    var xhr = new XMLHttpRequest();
    xhr.onload=function(){
        console.log(xhr.responseText)
        callback(xhr.responseText)
    }
    xhr.open('GET', window.parent.location.href, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.get(data); 
    
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
}

function genlist(){

}

function gendevices(devices){
    const page =$("#devicepage");
    page.innerHtml="";
    devices.forEach(function(){
        
    });
}