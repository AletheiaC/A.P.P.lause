import wixData from 'wix-data';

let keywordsArray = [];
let color;

$w.onReady(function () {

});

/********* first quiz selection *********/
export function whoTags_change(event) {
    keywordsArray.push(event.target.value[0]);
    $w('#quizStates').changeState('whatState');
}

/********* second quiz selection *********/
export function whatTags_change(event) {
    keywordsArray.push(event.target.value[0]);
    $w('#quizStates').changeState('colorState');
}

/********* third quiz selection *********/
export async function colorTags_change(event) {
    color = event.target.value[0];
    await keywordsArray.push(event.target.value[0]);
    $w('#quizStates').changeState('productState');
    getProducts(keywordsArray, color);
}

/********* getting products and setting the repeater data function *********/
function getProducts(keywordsArray, color) {
    let image;
    wixData.query('productsKeywords')
        .hasAll('keywords', keywordsArray)
        .include('product')
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                let resItems = results.items;
                let products = resItems.map(item => {
                    if (color === 'surpriseMe2') {
                        image = item.product.mainMedia
                    } else {
                        image = item[color]
                    }
                    return {
                        _id: item.product._id,
                        productName: item.product.name,
                        url: item.product.productPageUrl,
                        price: item.product.formattedPrice,
                        image: image
                    }
                })
                shuffle(products)
                $w('#productsRepeater').data = products.slice(0, 2);
            } else {
                $w('#loadingImage').hide();
                $w('#noItemsText').show();
            }
        });
}

/********* shuffle products array *********/
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // Wwile there remain elements to shuffle
    while (0 !== currentIndex) {

        // pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/********* setting the repeater elements to corresponding data *********/
export function productsRepeater_itemReady($item, itemData, index) {
    $item('#productTitle').text = itemData.productName;
    $item('#productImage').src = itemData.image;
    $item('#productImage').link = itemData.url;
    $item('#productImage').tooltip = '';
    $item('#productPrice').text = itemData.price;
    $w('#loadingImage').hide();
    $w('#productsRepeater').show();
}

/***************************************************************************************
*    Title: Gift Quiz
*    Author: Anon
*    Date: 2020
*    Code version: 1.0
*    Availability: https://www.wix.com/velo/example/gift-quiz
*
***************************************************************************************/