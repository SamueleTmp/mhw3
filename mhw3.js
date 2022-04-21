const proxy_url = "https://cors-anywhere.herokuapp.com/"
//Definiamo le costanti per l'api di Steam
const steam_app_list_rest = "https://api.steampowered.com/ISteamApps/GetAppList/v2/?"
const steam_key = "63C0064BD57450904D861FC7B7805BC6" 
let num = 0;



//Definiamo le costant per Spotify
const Spotify_token_url= "https://accounts.spotify.com/api/token"
const Spotify_auth = "https://api.spotify.com/authorize"

const Spotify_Search = "https://api.spotify.com/v1/search?"
const ClientID= "25c3f79f401c4b8d90ffe1208145aa82"
const ClientSecret = "9d057f61f6584ec08330118d8291cf2a"
let token_spotify = "";



//Funzioni Genearli
    //Otteniamo il file JSON e prendiamo il dato che ci interessa
function onResponse(response){
    console.log('Risposta ricevuta');
    return response.json();
}
    //Funzione nel caso di errore
function OnError(error){
    console.log('Errore: '+ error)
}
    //Per il blur degli input
function onBlur(event){
    console.log("blur")
    let input = document.querySelectorAll(".APIrest div input");
    for(let i=0; i<input.length; i++)
    {
        input[i].classList.remove("focus");
    }   

}
    //Per il focus degli input
function onFocus(event){
    console.log("Focus")

    let input = event.currentTarget;
    input.classList.add("focus");
}

//Funzioni per Steam
function onJSON_Steam(json){
    console.log(json);

    let appID = json.applist.apps[num].appid
    let name = json.applist.apps[num].name
    
    console.log(appID + " " + name);


    //eliminiamo il contenuto di tutto se presente
    const div = document.querySelector('.Steam .result');
    div.innerHTML = '';

    //creiamo l'elemento e il contenuto
    const title = document.createElement("h1");
    const content = document.createElement("p");

    title.textContent="Nome:\n" + name;
    content.textContent="AppID:\n"+appID;

    title.classList.add("title_result");
    content.classList.add("content_result");

    div.appendChild(title);
    div.appendChild(content);
}

    //Creiamo la funzione per l'event listener
function sendRequestSteam(event){
    event.preventDefault();
    
    const text_input = document.querySelector('#input_steam');
    const text_value = encodeURIComponent(text_input.value);

    console.log(text_value);
    num = text_value;

    //svuoto il testo qui e non nel onBlur
    text_input.value="";

    //provo ad usare l'api per le appList
    
    let rest_steam = proxy_url + steam_app_list_rest + "key=" + steam_key ;
    console.log("URL:" + rest_steam);

    fetch(rest_steam, 
                {metod: 'GET',
                 headers:{'Content-Type': 'application/json',
                          'X-My-Custom-Header': steam_key,
                          'Access-Control-Allow-Origin': '*',
                            'Origin' : 'http://127.0.0.1:5500/mhw3.js',
                            'X-Request-With': '*'}
                }).then(onResponse, OnError).then(onJSON_Steam);
}

//Funzioni per Spotify
function onJSON_Spotify(json){
    console.log(json);
    let items = json.tracks.items;
    
    let threshold =json.tracks.limit;

    if(json.tracks.items.length<threshold)
    {
        threshold = json.tracks.items.length;
    }
    //genero un numero casuale con il limit
    let random_number= Math.floor( Math.random()*(threshold));

    
    console.log(random_number);

    console.log(items[random_number].name + " " + items[random_number].artists[0].name);
    
    let sing = items[random_number].name;
    let artists = items[random_number].artists[0].name;
    


    //eliminiamo il contenuto di tutto se presente
    const div = document.querySelector('.Spotify .result');
    div.innerHTML = '';

    //creiamo l'elemento e il contenuto
    const title = document.createElement("h1");
    const content = document.createElement("p");

    title.textContent="Canzone: \n" + sing;
    content.textContent="Artista: \n"+artists;

    title.classList.add("title_result");
    content.classList.add("content_result");

    div.appendChild(title);
    div.appendChild(content);

}

function sendRequestSpotifyAPI(event){

    event.preventDefault();

    const text_input = document.querySelector('#input_spotify');
    const text_value = encodeURIComponent(text_input.value);

    console.log(text_value);

    text=text_value;
    //svuoto il testo qui e non nel onBlur
    text_input.value="";


    let rest_spotify= Spotify_Search + "q=" + text + "&type=track";

    //adesso faccio la fecth per l'api specifica
    fetch(rest_spotify,{
        method: 'GET',
            headers:{
                'Authorization' : 'Bearer ' + token_spotify,
            }
        }
    ).then(onResponse, OnError).then(onJSON_Spotify);

}

    //Creiamo la funzione per l'event listener per il token
function sendRequestSpotifyToken(event)
{
    
    //preparo la fecth per l'autenticazione
    fetch(Spotify_token_url,
    {
        method:"post",
        body: 'grant_type=client_credentials',
        headers:{
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(ClientID + ':' + ClientSecret)
        }
    }
    ).then(onTokenResponse).then(onTokenJson);

    
}

//Funzioni per il token
function onTokenJson(json)
{
  token_spotify = json.access_token;
  console.log(json);
  console.log(token_spotify);
}

function onTokenResponse(response) {
  return response.json();
}


//Aggiungiamo il blur e il focus a gli elementi input
let input_box= document.querySelectorAll(".APIrest div input");

for(let i=0; i<input_box.length; i++)
{
    input_box[i].addEventListener('blur', onBlur);
    input_box[i].addEventListener('focus', onFocus);
}

//Aggiungiamo un event listener al form per Steam
let form_steam = document.querySelector('.Steam form');

form_steam.addEventListener('submit', sendRequestSteam);

//Aggiungiamo un event listener al form per Spotify
let form_spotify = document.querySelector('.Spotify form');

form_spotify.addEventListener('submit', sendRequestSpotifyAPI);

//Ottengo il token di Spotify
sendRequestSpotifyToken();