/* global require, __dirname */

const fs = require("fs");
const path = require("path");
const Genius = require("genius-lyrics");

const JSON_PATH = path.resolve(__dirname, "../dat/billboard_100_top10.json");

const create_path = (file_name) => path.resolve(__dirname, "../dat/", file_name);
const create_save_name = (artist, title) => `${artist.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}-${title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}.txt`;

const save_lyrics = (file_name, lyrics) => fs.writeFile(create_path(file_name), lyrics);

const Client = new Genius.Client("3JUjWmokWiHNFpMif9_rwnjWPvcooPYbQ9zAqEFGAsO8-Cb7z0xk4YCrYHNd2xJi");
const get_lyrics = async function (artist, title) {
    // remove possible featuring artists from the query
    const searches = await Client.songs.search(artist.split(" feat")[0] + " " + title);
    const result = searches[0]; // first result is almost always the song we are looking for

    if (result) {
        // taking double A-side records in to account
        result.split(" / ").forEach(song => song.lyrics()
            .then(result => save_lyrics(create_save_name(artist, title), result))
            .catch(() => console.error("no lyrics found:", artist, title))
        );
    } else {
        console.error("nothing found:", artist, title);
    }
};

fs.readFile(JSON_PATH, (error, raw_data) => {

    if (error) {
        console.error(error);
    }

    const billboard_100 = JSON.parse(raw_data);
    const songs = Object.values(billboard_100).reduce((acc, val) => [...acc, ...val]);

    songs.forEach(current => {
        const file_name = create_save_name(current.artist, current.title);
        fs.access(create_path(file_name), fs.F_OK, (error) => {
            if (error) {
                get_lyrics(current.artist, current.title);
            }
            // else
        });
    });

});
