
import {get_billboards_top_ten} from "./loader.js";


get_billboards_top_ten(1960, 2020).then(result => {

    // console.log(result);

});

const headers = new Headers();
headers.append("Access-Control-Allow-Origin", "https://w0lf3n.github.io/Chorus-Analysis/");


fetch("https://genius.com/Blondie-call-me-lyrics", {
    headers
}).then(response => console.log(response));


