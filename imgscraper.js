var fs = require('fs');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');


var offer_photos=[]

async function run(num) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.olx.pl/oferty/q-psy-za-darmo/?page=${num}`);
  let content = await page.content();
  var $ = cheerio.load(content);
  let offers = $("div.offer-wrapper");
  offers.each((idx, el) => {
      let title= $(el).find(".margintop5").text().trim();
      title = title.slice(0, title.indexOf("\n"))
      let photo = $(el).find("img").attr("src");
      let link =  $(el).find("a").attr("href");
      let location = $(el).find(".lheight16").find("span").text();
      let uniqueId= idx+link.slice(link.length-5,link.length-1)+idx;

      if(location.indexOf("dzisiaj")> 0) {
location = location.slice(0,location.indexOf("dzisiaj"))
}

 if(location.indexOf("wczoraj")> 0) {
location = location.slice(0,location.indexOf("wczoraj"))
}

      offer_photos.push({"id": uniqueId , "title": title, "photo": photo, "link":link, "location": location});
})
 
  browser.close();
}

async function scraper(){

      for(let xyz=6; xyz<7; xyz++){
              await run(xyz);
}

fs.writeFile ("db6.json", JSON.stringify(offer_photos), function(err) {
    if (err) throw err;
    console.log('complete');
    }
);

console.log(offer_photos)
}

scraper();


