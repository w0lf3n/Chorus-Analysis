
import {get_billboards_top_ten} from "./loader.js";


const top_ten = get_billboards_top_ten(1960, 2020);

const output = document.createElement("code");
document.body.appendChild(output);
output.textContent = JSON.stringify(top_ten);
