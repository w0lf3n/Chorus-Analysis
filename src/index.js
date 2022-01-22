
import {get_billboards_top_ten} from "./loader.js";


const top_ten = get_billboards_top_ten(1950, 2020);
document.write(JSON.stringify(top_ten));
