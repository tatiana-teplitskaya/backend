const fs = require('fs');

export function getArrFromFile(filedata){
    let newFilms = [];
    let fileContent = fs.readFileSync(filedata.path, "utf8");
    newFilms = getArrOfFilms(fileContent.split("\n"));

    return newFilms;
}


export function getArrOfFilms(arr){
    let arrOfFilms = [];
    let formattedArrays = [];
    let tempArr = [];
    arr.forEach(str => {
        if (str === ''){

            formattedArrays = [...formattedArrays, tempArr];
            tempArr = [];

        } else {

            tempArr = [...tempArr, str.split(':').map(el => el.trim())];

        }
    });
    //console.log(formattedArrays);

    formattedArrays.forEach(arr => {
        let tempObj = {};
        arr.forEach(row => {

            switch(row[0]){

                case 'Title':
                    tempObj.title = row[1];
                    break;
                case 'Release Year':
                    tempObj.year = parseInt(row[1]);
                    break;
                case 'Format':
                    tempObj.format = row[1];
                    break;
                case 'Stars':
                    tempObj.stars = row[1].split(',').map(star => star.trim());
                    break;
                default:
                    return

            }
        })
        if (Object.keys(tempObj).length){
            arrOfFilms = [...arrOfFilms, tempObj];
        }
    })
    return arrOfFilms;
}