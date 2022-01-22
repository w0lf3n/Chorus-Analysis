
import {get_billboards_top_ten} from "./loader.js";


get_billboards_top_ten(1960, 2020).then(result => {

    // console.log(result);

});

fetch("https://genius.com/Blondie-call-me-lyrics").then(response => console.log(response));


