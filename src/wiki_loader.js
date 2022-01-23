
const get_billboards_top_ten = async function (from_year, to_year) {

    const API_URL = "https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=Billboard_Year-End_Hot_100_singles_of_%YEAR%&format=json";

    const top_ten = {};

    const fetch_top_ten_of_year = async function (year) {

        const wrapper = document.createElement("div");
        wrapper.style.display = "none";
        document.body.appendChild(wrapper);

        return fetch(API_URL.replace(/%YEAR%/, year))
            .then(response => response.json())
            .then(result => {

                wrapper.innerHTML = result.parse.text["*"];
                const rows = wrapper.querySelectorAll(".wikitable tbody tr");

                top_ten[year] = [];

                for (let i = 1; i < 11; i = i + 1) {
                    const positions = rows[i];
                    if (positions) {

                        const data = positions.textContent.split("\n");
                        const links = positions.querySelectorAll("a");

                        // taking double A-side records into account
                        data[2].replace(/"/g, "").split(" / ").forEach((title, index) => {
                            top_ten[year].push({
                                pos: data[1],
                                title,
                                artist: data[3],
                                link: (links.length > 0) ? links[index].href : ""
                            });
                        });

                    } else {
                        console.error(year);
                    }
                }

                wrapper.remove();
            });

    };

    const promises = [];

    for (let i = from_year; i < to_year + 1; i = i + 1) {
        promises.push(fetch_top_ten_of_year(String(i)));
    }

    await Promise.all(promises);
    return JSON.parse(JSON.stringify(top_ten).replaceAll("/wiki/", ""));
};

export {
    get_billboards_top_ten
};
