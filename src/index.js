
import {get_billboards_top_ten} from "./loader.js";


const top_ten = get_billboards_top_ten(1970, 1979);
document.write(JSON.stringify(top_ten));
