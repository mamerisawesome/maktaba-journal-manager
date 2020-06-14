// code from https://github.com/t04glovern/aws-s3-cat-images/blob/master/index.html
// to extract cats from thesecatsdonotexist.com
const getRandomCat = () => {
    const folderNumber = Math.floor((Math.random() * 6) + 1);
    let catNumber = 0;
    switch (folderNumber) {
        case 1:
            catNumber = Math.floor((Math.random() * 5000) + 1);
            return "04/cat" + catNumber + ".jpg";
        case 2:
            catNumber = Math.floor((Math.random() * 5000) + 1);
            return "05/cat" + catNumber + ".jpg";
        case 3:
            catNumber = Math.floor((Math.random() * 5000) + 1);
            return "06/cat" + catNumber + ".jpg";
        case 4:
            catNumber = Math.floor((Math.random() * 5000) + 1);
            return "04/cat" + catNumber + ".jpg";
        case 5:
            catNumber = Math.floor((Math.random() * 5000) + 1);
            return "05/cat" + catNumber + ".jpg";
        case 6:
            catNumber = Math.floor((Math.random() * 5000) + 1);
            return "06/cat" + catNumber + ".jpg";
        default:
            return "";
    }
};

const getCatImageUrl = () => {
    return "https://d2ph5fj80uercy.cloudfront.net/" + getRandomCat();
};

export { getCatImageUrl };
