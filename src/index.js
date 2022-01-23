/* global require, __dirname */

const fs = require("fs");
const path = require("path");
const Genius = require("genius-lyrics");

const JSON_PATH = path.resolve(__dirname, "../dat/billboard_100_top10.json");

const create_path = (file_name) => path.resolve(__dirname, "../dat/songs/", file_name);
const create_save_name = (artist, title) => `${artist.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}-${title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}.txt`;

const save_lyrics = (file_name, lyrics) => fs.writeFile(create_path(file_name), lyrics, error => {
    if (error) {
        console.error("error saving file", file_name);
    }
});

const Client = new Genius.Client("3JUjWmokWiHNFpMif9_rwnjWPvcooPYbQ9zAqEFGAsO8-Cb7z0xk4YCrYHNd2xJi");
const get_lyrics = async function (artist, title) {

    // switch artist and title for better results
    const results = await Client.songs.search(title + " " + artist);

    if (results instanceof Array && results.length > 0) {

        // search for the most viewed version of that song
        let hit = results
            .filter(song => Object.prototype.hasOwnProperty.call(song.raw.stats, "pageviews"))
            .sort((song_a, song_b) => song_a.raw.stats.pageviews < song_b.raw.stats.pageviews)[0];

        if (!hit) {
            hit = results[0];
        }

        const fullTitle = hit.fullTitle.toLowerCase().replace(/\s/g, "");
        if (fullTitle.includes(artist.toLowerCase().replaceAll(" ", ""))
            && fullTitle.includes(title.toLowerCase().replaceAll(" ", ""))) {

            const lyrics = await hit.lyrics();
            if (lyrics !== undefined && lyrics !== null) {
                save_lyrics(create_save_name(artist, title), lyrics);
            } else {
                console.error("no lyrics found:", artist, title);
            }

        } else {
            console.error("no song found:", artist, title);
        }

    } else {
        console.error("no results found", artist, title);
    }

};

const adjust_artist_name = (name) => name.split(" feat")[0].replace(/\(.*?\)/g, "").replace(/[.,]/g, "").trim().replace("&", "and");
const adjust_song_title = (title) => title.replace(/\(.*?\)/g, "").replace(/[.,]/g, "").trim();

const make_genius_request = function (song) {

    const artist = adjust_artist_name(song.artist);
    const title = adjust_song_title(song.title);

    get_lyrics(artist, title)
        .catch(() => console.error("ERR no lyrics found", artist, title));
};

// fs.readFile(JSON_PATH, (error, raw_data) => {

//     if (error) {
//         console.error(error);
//     }

//     const billboard_100 = JSON.parse(raw_data);
//     const songs = Object.values(billboard_100).reduce((acc, val) => [...acc, ...val]);

//     songs.forEach(current => {

//         const file_name = create_save_name(adjust_artist_name(current.artist), adjust_song_title(current.title));
//         fs.stat(create_path(file_name), (error, stats) => {

//             if (error) {
//                 console.error("error", "file not found", file_name);
//             }

//             if (stats && stats.isFile()) {
//                 //
//             } else {
//                 make_genius_request(current);
//             }

//         });
//     });

// });

(async function (artist, title) {

    const results = await Client.songs.search(title + " " + artist);

    let hit = results
        .filter(song => Object.prototype.hasOwnProperty.call(song.raw.stats, "pageviews"))
        .sort((song_a, song_b) => song_a.raw.stats.pageviews > song_b.raw.stats.pageviews)[0];
    if (!hit) {
        hit = results[0];
    }

    console.log(hit);

    const fullTitle = hit.fullTitle.toLowerCase().replace(/\s/g, "");
    if (fullTitle.includes(artist.toLowerCase().replaceAll(" ", ""))
        && fullTitle.includes(title.toLowerCase().replaceAll(" ", ""))) {
        const lyrics = await hit.lyrics();
        console.log(lyrics);
    }


})("Pink Floyd", "Another Brick in the Wall");

/*
if no song found check page content for instrumental

no results found Walter Murphy and The Big Apple Band A Fifth of Beethoven
no song found: Hugo Montenegro The Good the Bad and the Ugly
no song found: Pink Floyd Another Brick in the Wall Part II
no song found: Percy Faith Theme from A Summer Place
no song found: Paul and Paula Hey Paula

no song found: Macklemore and Ryan Lewis -> 2525 - Can't Hold Us
no results found Macklemore and Ryan Lewis Thrift Shop

no song found: Kool and the Gang Celebration
no song found: The Black Eyed Peas Boom Boom Pow


ERR no lyrics found Paul Mauriat Love is Blue
*/

/*
    length - single/radio edit
    genre
    language
*/
