
import {get_billboards_top_ten} from "./loader.js";


get_billboards_top_ten(1960, 2020).then(value => {
    const output = document.createElement("code");
    document.body.appendChild(output);
    output.textContent = value;
});

