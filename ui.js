//document.getElementById('display').innerText="true";
$(document).ready(function() {
    $("#mycolor").colorpicker({
        defaultPalette: 'web'
    });
    show('home');

    $("#mycolor").on("change.color", function(event, color){
        send("color:"+color);
    });
});

function send(data){
    window.parent.postMessage(data, '*');
    //document.getElementById('display').innerText=data;
    console.log(data)
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

