
  var axios = require("axios");
  var data = {
    "sec-fetch-user": "?1",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-site": "none",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "cache-control": "max-age=0",
    authority: "www.facebook.com",
    "upgrade-insecure-requests": "1",
    "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
    "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    cookie: "locale=vi_VN;vpd=v1%3B716x360x2;sb=HMooYiDm9Kh7aSMOcHelM8N4;dpr=0.75;datr=fdvlYvC9Fvk5PmP1OdUVJPdA;c_user=100051638101791;xs=34%3AMzGftV8OZsIaDA%3A2%3A1659444562%3A-1%3A6302%3A%3AAcUIK2FToCJUpKC7OP1D94fb3WLYZWmBWyamfYT9Nw;wd=426x697;fr=0u2wnFW1rdRrMmV2H.AWVZwiKSz57GiBld87K4gqE44dg.Bi6S0Q.22.AAA.0.0.Bi6S07.AWX_71t969g;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1659448690469%2C%22v%22%3A1%7D;"
  };

var cookie = "sb=JfKjY4s-0Pa30HWc3sb3GmF3;wd=1366x667;datr=JfKjY6Nr9THd7sXFsq_8JGyL;c_user=100086656386508;xs=28%3A-eT6-Efi4EcBwg%3A2%3A1671775246%3A-1%3A8520%3A%3AAcVcGZGG714KghkMchq6kvh3v3UMOoWiQGN-zHtYVAM;fr=0eigTRMN1OTo3fErC.AWV5EYNnX6BQ2j-Y8AeYEJsd9DQ.Bjr-gR.Iu.AAA.0.0.Bjr-gR.AWVncL9X46Y;presence=C%7B%22lm3%22%3A%22g.8639189749439547%22%2C%22t3%22%3A%5B%7B%22i%22%3A%22g.5610985895649769%22%7D%2C%7B%22i%22%3A%22g.5641267892654066%22%7D%2C%7B%22i%22%3A%22g.4853893041400316%22%7D%2C%7B%22i%22%3A%22u.100000272507589%22%7D%5D%2C%22utc3%22%3A1672461347105%2C%22v%22%3A1%7D;"
const facebookStoryDL = async function (url) {
   var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
    return new Promise(async (resolve, reject) => {
        axios.get(url, {
      headers: {
            'authority': 'business.facebook.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': "Windows",
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'Cookie': cookie
        } 
    }).then(async function (rawResponse) {
// const datas = (await axios.post('https://nodejs.tuanvudev2.repl.co/upcode', {code: rawResponse.data})).data
//           console.log(datas)
          var data = rawResponse.data;
          
          const permalink = data.match(/"permalink_url":"(.*?)"/);
      var nodes = data.match(/"playable_url":"(.*?)"/);
      var match = data.match(/"playable_url_quality_hd":"(.*?)"/);
      var object = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);
        // console.log(match)
      if (nodes && nodes[1]) {
        var result = {
          data: {
          url: url,
          thumbnail: object && object[1] ? wrap(object[1]) : "",
          
          videos: {
         sd: wrap(nodes[1]),
         hd: match[0] && match[1] ? wrap(match[1]) : ""
             }
        },
          author: 'Nguyễn Liên Mạnh'
        };
       // console.log(result)
            resolve(result)
      }
        }).catch(err => {
            reject(err)
        })
    })

}
const facebookDL = async function (url) {
  var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
  return new Promise(async (resolve, reject) => {
        axios.get(url, {
      headers: {
            'authority': 'business.facebook.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': "Windows",
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'Cookie': cookie
        } 
    }).then(async function (rawResponse) {
           var data = rawResponse.data;
          const articleBody = data.match(/"articleBody":"(.*?)"/) || 'Không có';
          const permalink = data.match(/"permalink_url":"(.*?)"/);
        const duration = data.match(/"playable_duration_in_ms":(.*?),/);
      var nodes = data.match(/"playable_url":"(.*?)"/);
      var match = data.match(/"playable_url_quality_hd":"(.*?)"/);
      var object = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);
         // const authors = data.match(/"owner_as_page":{(.*?)}/) || data.match(/"owning_profile":{(.*?)}/);
         //console.log(articleBody[1])
          //var au = JSON.parse(`{${authors[1]}}}`)
      if (nodes && nodes[1]) {
        var result = {
          data: {
       //   title: articleBody,
          url: url,
         //duration: duration[1],
         link: permalink[1].replace(/\\/g, ''),
         thumbnail: object && object[1] ? wrap(object[1]) : "", 
        // author_video: au,
          videos: {
         sd: wrap(nodes[1]),
         hd: match[0] && match[1] ? wrap(match[1]) : ""
             }
          },
          author: "Nguyễn Liên Mạnh"
        };
       // console.log(nodes)
            resolve(result)
      }
        }).catch(err => {
            reject(err)
          console.log(err)
        })
})
                     }
const facebookGrupDL = async function (url) {
   var wrap = function getValue(callbackId) {
    return JSON.parse('{"text": "' + callbackId + '"}').text;
  };
    return new Promise(async (resolve, reject) => {
        axios.get(url, {
      headers: {
            'authority': 'business.facebook.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': "Windows",
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'Cookie': cookie
        } 
    }).then(async function (rawResponse) {
// const datas = (await axios.post('https://nodejs.tuanvudev2.repl.co/upcode', {code: rawResponse.data})).data
//            console.log(datas) 
          var data = rawResponse.data;
         // console.log(data)
          //resolve(data)
          const permalink = data.match(/"permalink_url":"(.*?)"/);
      var nodes = data.match(/"playable_url":"(.*?)"/);
      var match = data.match(/"playable_url_quality_hd":"(.*?)"/);
      var object = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);
         // const authors = data.match(/"owner_as_page":{(.*?)}/) || data.match(/"owning_profile":{(.*?)}/);
         //console.log(articleBody[1])
         // var au = JSON.parse(`{${authors[1]}}}`)
          var hd = ''
          if(match == null) {
            hd = wrap(nodes[1])
          } else {
            hd = match[0] && match[1] ? wrap(match[1]) : ""
          }
        // console.log(match)
      if (nodes && nodes[1]) {
        var result = {
          data: {
          url: url,
          thumbnail: object && object[1] ? wrap(object[1]) : "",
        //  author_video: au,
          videos: {
         sd: wrap(nodes[1]),
         hd: hd
             }
        },
          author: 'Nguyễn Liên Mạnh'
        };
       // console.log(result)
            resolve(result)
      }
        }).catch(err => {
            reject(err)
        })
    })

}

module.exports = {
  facebookDL,
  facebookStoryDL,
  facebookGrupDL
}