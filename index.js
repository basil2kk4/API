
require("dotenv").config()



// Importing Libraies that we installed using npm
var creator = 'Nguyễn Liên Mạnh'
const express = require("express");
const rateLimit = require("express-rate-limit");
const { loadImage, createCanvas } = require("canvas");
const Canvas = require('canvas');
const rq = require('request')
const helmet = require("helmet");
const ytdl = require('ytdl-core');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const totp = require('totp-generator');
const getIP = require('ipware')().get_ip;
const mongoose = require("mongoose");
const DBuser = require("./db/user")
const log = require("./utils/logger");
const logger = require("./utils/logger").banner;
const app = express()
const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const moment = require("moment-timezone");

global.client = new Object({
  ip: new Map(),
  max: new Map(),
  time: new Map()
});

const { ip, max, time } = global.client;

global._404 = process.cwd() + '/_404.html';

initializePassport(
  passport,
  email => DBuser.findOne({ email }),
  id => DBuser.findOne({ id })
)
/*initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )*/
//https://api.maihuybao.live/api/getToken?account=100086063221253%7Ctaomuondie114%7CYW7APVL4LANLPY5SPXSLTYOAOFEIZ445&type=EAAD
const tokens = 'EAAD6V7os0gcBAElRneFGw6vzvV6GKCSVsY8Gihdmg0oiZAFaOM8qAFNMbX35PCu2ZAZB9b9rs4FFHMWEqlfhl2VKY5a5xJtZCf7bjMlzzh3ZAHthXIcsQfJGsLY9GpLKw36WVXRicZCSe9B0MZAStZBkOjPT1SEtHI9Wgr4IfMpAXfVbua8KgHOivc9UBdIaTeMZD'

const cook = 'datr=NLUhY4hqzATC6rHN2FioN4_n;sb=NLUhY4A_BWx6Me6QPqwXOIXo;vpd=v1%3B783x393x2.75;m_pixel_ratio=2.75;locale=vi_VN;c_user=100086063221253;xs=43%3AVHxKS7wHb89nig%3A2%3A1671970327%3A-1%3A8520;fbl_st=101124104%3BT%3A27866172;fbl_cs=AhA%2Fma39OsiOHyV3%2BMSEUV%2FZGGljR3EvR2k2Q3F2RUI5eUVxPXpBeWNaUg;fbl_ci=1200280667500848;m_page_voice=100086063221253;wd=1322x661;fr=0JQEArW8FiJj0AWCk.AWVlXaPcprXmtl5w2B9OnwUCv24.BjjXOw.VL.AAA.0.0.Bjulgn.AWV6Unc8TSo;presence=C%7B%22lm3%22%3A%22g.5683963321717387%22%2C%22t3%22%3A%5B%7B%22i%22%3A%22g.7385910631479636%22%7D%2C%7B%22i%22%3A%22g.6077668002295966%22%7D%2C%7B%22i%22%3A%22g.5641267892654066%22%7D%5D%2C%22utc3%22%3A1673156869506%2C%22v%22%3A1%7D;'
loghandler = {
  noturl: {
    status: false,
    creator: `${creator}`,
    code: 406,
    message: 'Missing URL format'
  },
  notquery: {
    status: false,
    creator: `${creator}`,
    code: 406,
    message: 'Missing query of path'
  },
  notbody: {
    status: false,
    creator: `${creator}`,
    code: 406,
    message: 'missing data body'
  },
  error: {
    status: 404,
    creator: `${creator}`,
    message: ''
  }
}

const users = [
  {
    id: '',
    name: '',
    email: '',
    password: '',
    password_no_enc: "",
    time_join: ''
  }
]
var api_key_mongo1 = ''//công khai
var api_key_mongo = ''//riêng tư
const MONGO_URI = ""

//Connecting to the database
// mongoose
//   .connect(MONGO_URI, {
//    useNewUrlParser: true,
//     useUnifiedTopology: true,
//     //   useCreateIndex: true,
//     //   useFindAndModify: false,
//   })
//   .then(() => {
//     logger("Successfully connected to database");
//   })
//   .catch((error) => {
//     logger("database connection failed. exiting now...");
//     console.error(error);
//    // process.exit(1);
//   });
const limiter = rateLimit({
  // 15 minutes
  windowMs: 5 * 60 * 1000,
  // limit each IP to 100 requests per windowMs
  max: 300,
  message: 'Oop too many requests',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
var hei = "0.11"
app.use(express.urlencoded({ extended: false }))
app.use(express.static("/views"))
app.use(flash())
app.use(session({
  secret: hei,
  resave: false, // We wont resave the session variable if nothing is changed
  saveUninitialized: false
}))
app.use(helmet());
//app.use(limiter);
app.use(passport.initialize())
app.use(express.json());
app.set("json spaces", 4);
app.use(passport.session())
app.use(methodOverride("_method"))
app.use('/v2', require('./api-v2/index.js')())
app.get('/upcode', function(req, res) {
  res.sendFile(__dirname + '/views/upcode.html')
})
app.get('/nhac', function(req, res) {
  res.sendFile(__dirname + '/views/index_music.html')
})

//cấu hình lưu trữ file khi upload xong
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
    cb(null, 'uploads')
  },
  filename: function(req, file, cb) {
    // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, filename + '-' + file.originalname)
  }
})
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({ storage: storage })


app.get('/css/:filename', (req, res) => {
  // console.log(req.params)
  res.sendFile(__dirname + '/views/css/' + req.params.filename)
})
app.get('/js/:filename', (req, res) => {
  // console.log(req.params)
  res.sendFile(__dirname + '/views/js/' + req.params.filename)
})
app.get('/image/:filename', (req, res) => {
  // console.log(req.params)
  res.sendFile(__dirname + '/views/img/' + req.params.filename)
})
app.use(limiter, (req, res, next) => {
  console.log(req.isAuthenticated())
  var ipInfo = getIP(req)

  log(`IP: ${ipInfo.clientIp} - Đã yêu cầu tới path: ${decodeURIComponent(req.url)}`, 'STATUS');
  next();

  //(ipInfo.clientIp !== '113.174.134.64') return;

});
/* --------------- UPLOAD ẢNH Start --------------- */

app.post('/upload', upload.single('formFile'), (req, res, next) => {
  //nhận dữ liệu từ form
  const id_user = req.user.id//"1111000001"
  const file = req.file;
  // Kiểm tra nếu không phải dạng file thì báo lỗi
  if (!file) {
    const error = new Error('Vui lòng chọn ảnh trước khi upload')
    error.httpStatusCode = 400
    return next(error)
  }
  logger(file)
  // file đã được lưu vào thư mục uploads
  // gọi tên file: req.file.filename và render ra màn hình

  fs.rename(__dirname + `/uploads/${req.file.filename}`, __dirname + `/uploads/${id_user}` + ".png", function(err) {
    if (err) throw err;
    logger('Rename ảnh thành công!');
  });
  res.redirect("/user")
  //res.sendFile(__dirname + `/uploads/${id_user}.png`);
})

app.post('/uploads', async function(req, res) {
  var account = req.body.url

  if (account == '') {
    return res.json(loghandler.noturl)
  }
  var format = rq.get(account);
  var namefile = format.uri.pathname;
  var id = ((Math.random() + 1).toString(36).substring(2))//.toUpperCase()
  var format = (namefile.slice(namefile.lastIndexOf(".") + 1))
  try {
    var path = __dirname + '/upload/' + id + '.' + format;
    const audio = account.match("audioclip")
    //  console.log(audio)
    if (audio != null) {
      var mp3 = __dirname + '/upload/' + id + '.mp3';
      let getimg = (await axios.get(account, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(mp3, Buffer.from(getimg, "utf-8"))
      res.json({
        statut: true,
        url: 'https://apivip.nguyenlienmanh.me/upload/' + id + '.mp3'
      })
    } else {
      let getimg = (await axios.get(account, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(path, Buffer.from(getimg, "utf-8"))
      res.json({
        statut: true,
        url: 'https://apivip.nguyenlienmanh.me/upload/' + id + '.' + format
      })
    }
  } catch (e) {
    res.json({
      statut: false,
      message: 'Lỗi tải ảnh lên sever!'
    })
  }

})
app.get('/insss', async (req, res, next) => {
    var axios = require('axios');
    var { username, url } = req.query;
    if(!username && !url) return res.json({ error: true, message: "Không có username hoặc url media" });
    try {
        username ? getInfoInstagram(username).then((data) => {
            res.json(data);
        }) : getInfoMediaInstagram(url).then((data) => {
            res.json(data);
        });
    }
    catch (error) {
        res.json({ error: true, message: error });
    }
    async function getInfoInstagram(username) {
        try {
            var response = await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
                headers: {
                    'x-ig-app-id': 936619743392459
                }
            })
            var data = response.data.data;
            return data.user
        } catch (error) {
            return {
                status: 404,
                message: "Không tìm thấy người dùng"
            }
        }
    }

    async function getInfoMediaInstagram(url) {
        if (!url) return 403;
        var regex = /https:\/\/www.instagram.com\/(p|reel)\/([a-zA-Z0-9-_]+)\/?/g;
        var id = regex.exec(url)[2];
        try {
            var variables = JSON.stringify({
                "shortcode": id,
                "child_comment_count": 3,
                "fetch_comment_count": 40,
                "parent_comment_count": 24,
                "has_threaded_comments": true
            });
            var hash = "b3055c01b4b222b8a47dc12b090e4e64"
            var response = await axios.get("https://www.instagram.com/graphql/query/?query_hash=" + hash + "&variables=" + variables);
            var data = response.data;
            return data.data.shortcode_media
        } catch (error) {
            return {
                status: 404,
                message: "Không tìm thấy media"
            }
        }
    }
})
app.get('/upload/:id', async (req, res, next) => {
  res.sendFile(__dirname + `/upload/${req.params.id}`);
})
app.get('/upload/:id/_v', async (req, res, next) => {
  const dow = req.query.download
  // console.log(req.query) 
  // console.log(req.params)
  if (dow == 'true') {
    res.download(__dirname + `/upload/${req.params.id}`);
  }
})

app.get('/avt', (req, res, next) => {
  const id_user = req.user.id
  res.sendFile(__dirname + `/uploads/${id_user}.png`);
})
/* --------------- UPLOAD ẢNH END --------------- */
app.get('/uptime', async (req, res) => {
  const { get } = require('axios');
  const { link } = req.query;
  get('https://uptime.nmanh2k4.repl.co/uptime?data=' + link).then(response => res.json(response.data)).catch(error => res.json({ error }))
})
app.get('/xulq', async (req, res) => {
  const responseData = [];

  // Loop through the pages
  for (let i=1; i<=10; i++) {
    const queryData = [
      {"variables":{}, "extensions":{"persistedQuery":{"version":1,"sha256Hash":"d8837208a979dd1e14f213e28d3b65686bb3e133cc9bbdead249c22a88e496b5"}}},
      {"operationName":"c","variables":{"filter":{},"page":i},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"8969c914c2ca472f8181b417897c7e2e775603193392ea3d7e5dfeb79444a155"}}}
    ];

    try {
      const response = await axios.post("https://xuphat.lienquan.garena.vn/graphql", queryData, {
        headers: {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,fr-FR;q=0.6,fr;q=0.5",
          "content-type": "application/json",
          "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "cookie": "_ga=GA1.2.847420124.1684598309",
          "Referer": "https://xuphat.lienquan.garena.vn/?fbclid=IwAR3iKlKfvdd0iyQuUNliC6e6bVBx-FF8b31NpnDyE82xAhZdcKkBq7r8wsI",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      });

      responseData.push(response.data);
    } catch (err) {
      res.json({
        status: false,
        code: err.code,
        message: err.message
      });
    }
  }

  res.json(responseData);
});
app.get('/api/tw', (req, res) => {
    var user = req.query.user;
get(`https://api.twitter.com/1.1/users/search.json?q=${user}`, {headers:{'Authorization':'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'}}).then(data => {
      res.json(data.data)
    }).catch(err => {
      res.json({
        status: false,
        code: err.code,
        message: err.message
      })
    })
})

  app.get('/api/data', (req, res) => {
    var user = req.query.user;
      if (!user) return res.json({ error: 'Thiếu dữ liệu để khởi chạy chương trình ' });
axios.post("https://xuphat.lienquan.garena.vn/graphql", {
  "operationName": "c",
  "variables": {
    "filter": { "search": user },
    "page": 0
  },
  "extensions": {
    "persistedQuery": {
      "version": 1,
      "sha256Hash": "8969c914c2ca472f8181b417897c7e2e775603193392ea3d7e5dfeb79444a155"
    }
  }
}, {
  headers: {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,fr-FR;q=0.6,fr;q=0.5",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  referrer: "https://xuphat.lienquan.garena.vn/?fbclid=IwAR3iKlKfvdd0iyQuUNliC6e6bVBx-FF8b31NpnDyE82xAhZdcKkBq7r8wsI",
  referrerPolicy: "strict-origin-when-cross-origin",
  withCredentials: true
})
  .then(data => {
      res.json(data.data)
    }).catch(err => {
      res.json({
        status: false,
        code: err.code,
        message: err.message
      })
    })
})


/* --------------- API INSTAGRAM Start --------------- */
app.get('/instagrams/:type', async (req, res) => {
  const api = require('./api/instagram.js')
  var { type } = req.params;
  var username = req.query.username
  var url = req.query.url
  // console.log(type + '\n' + username)
  if (type == "info") {
    if (!username) return res.json({
      statut: false,
      message: "Invaild Username"
    });
    api.igInfo(username).then(data => {
      res.json(data)
    }).catch(err => {
      res.json({
        statut: false,
        code: err.code,
        messgae: err.message// "Lỗi không mong muốn khi lấy thông tin người dùng!"
      })
    })
  } else if (type == "search") {
    if (!username) return res.json({
      statut: false,
      message: "Invaild Username"
    });
    api.search(username).then(data => {
      res.json(data)
    }).catch(err => {
      res.json({
        statut: false,
        code: err.code,
        messgae: err//.message// "Lỗi không mong muốn khi lấy thông tin người dùng!"
      })
    })
  } else if (type == 'videodl') {
    if (!url) return res.json({
      statut: false,
      message: "Invaild url"
    });
    api.videodl(url).then(data => {
      res.json(data)
    }).catch(err => {
      res.json({
        statut: false,
        code: err.code,
        messgae: err.message
      })
    })
  } else if (type == 'audiodl') {
    if (!url) return res.json({
      statut: false,
      message: "Invaild url"
    });
    api.audiodl(url).then(data => {
      res.json(data)
    }).catch(err => {
      res.json({
        statut: false,
        code: err.code,
        messgae: err.message
      })
    })
  } else {
    res.json({
      error: true,
      messgae: "Sai type!"
    })

  }
})
app.get('/yt', async function(req, res, next) {

  var data = await ytdl.getInfo(req.query.url)
  var account = data.player_response.streamingData.adaptiveFormats
  res.json(account)
})
/* --------------- API YOUTUBE Start --------------- */
app.get('/youtube', async function(req, res, next) {
  const app = require('./api/youtube.js')
  var {
    search,
    GetChannelById,
    GetVideoDetails,
    GetVideoId,
    dlvideo,
    GetPlaylistData,
    GetSuggestData
  } = req.query
  try {
    if (search) {
      var data = await app.GetListByKeyword((search))
      return res.json(data)
    }
    if (GetVideoDetails) {
      var data = await app.GetVideoDetails(GetVideoDetails)
      return res.json(data)
    }
    if (GetVideoId) {
      var data = await app.GetVideoId(GetVideoId)
      return res.json({
        id: data
      })
    }
    if (dlvideo) {
      var id = await app.GetVideoId(dlvideo)
      // console.log(id)
      var data = await app.downloadVideo(id)
      return res.json(data)

    }
  } catch (e) {
    return res.json({
      error: true
    })
  }
})
app.get('/facebook/download', async (req, res, next) => {
  let [app, cache, isURL, isFB] = [require('express')(), {}, url=>/^http(s|):\/\//.test(url), url=>/^http(|s):\/\/([^]*)(facebook|fb)\.(com|watch)\//.test(url)];
    let rep = (data, code = 200)=>res.status(code).send(data);
    let url = req.url.slice(req.url.indexOf('url=')+4);
    if (!url || !isURL(url))return rep(`Chưa Nhập Liên Kết Bài Đăng.`, 400);   
    if (!isFB(url))return rep(`Liên Kết Chưa Xác Định.`);
    if (/story\.php/.test(url))url = url.replace('://m', '://www');
    let data = cache[url] || await fetch(url, {
        headers: {
            "accept": "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            "encoding": "gzip",
            "cookie": "sb=SUViZM2yJkATh6Y6o3FuE1Td; datr=SUViZCOPtsKHWx5yp0-rywSx; dpr=1.25; c_user=100000457759839; m_page_voice=100000457759839; wd=1536x664; presence=C%7B%22lm3%22%3A%22g.8866473426727509%22%2C%22t3%22%3A%5B%5D%2C%22utc3%22%3A1685588134466%2C%22v%22%3A1%7D; xs=38%3ARUT-Z8QCZVgOlg%3A2%3A1684161908%3A-1%3A6316%3A%3AAcWFICmh9o8szKdKdR09m8DpI7PO2mRNrFaJkdjSzlif; fr=0WMulbOfYg5ZflyAr.AWVqTokl_1GC5YX5VY57CloFfnY.BkeAsV.FI.AAA.0.0.BkeAsV.AWV7Qn-8srk; useragent=TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzExMy4wLjAuMCBTYWZhcmkvNTM3LjM2; _uafec=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F113.0.0.0%20Safari%2F537.36; ",
            "user-agent": "Mike ozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
        },
    }).then(res=>res.text()).then(text=>text.split(/data\-sjs>|<\/script>/).filter($=>/^\{"require":/.test($)).map($=>JSON.parse($))); cache[url] = data;
    let repData = {
        message: '',
        attachment: [],
    };
    let _ = allValueByKey(data, [['attachment'], ['attachments'], ['message'], ['unified_stories'], ['video'], ['five_photos_subattachments']]);
    let msg = (i, m = _.message)=>m?.[i]?.story?.message?.text || m?.[i]?.text;
    repData.message = msg(2) || msg(0) || null;

    if (/(\/reel\/|watch)/.test(url)) {
        if (_.attachments.length > 0 && typeof _.attachments[0][0].media == 'object')repData.attachment.push(_.attachments[0][0].media); else if (_.video.length > 0)repData.attachment.push((_.video[0].__typename = 'Video', _.video[0]));
    };
    if (/\/stories\//.test(url)) {
        for (let i of _.unified_stories)for (let e of i.edges) {
            let media_story = e?.node?.attachments?.[0]?.media;

            if (!!media_story)repData.attachment.push(media_story);
        };
    };
    if (/\/((posts|permalink|videos)\/|story\.php)/.test(url)) {
        let a = _.attachment;
        let fpsa = _.five_photos_subattachments[0]?.nodes;
        let b = a?.[0]?.all_subattachments?.nodes || (fpsa?.[0]?fpsa: fpsa) || (a?.[0]?[a[0]]: []);
        repData.attachment.push(...b.map($=> {
            let vd = $?.media?.video_grid_renderer;

            if (!!vd)delete $.media.video_grid_renderer;

            return {
                ...$.media,
                ...(vd?.video || {}),
            };
        }));
        if (_.attachments.length > 0)repData.attachment.push(_.attachments[0][0].media);
    };
    repData.attachment = repData.attachment.filter($=>!!$).map($=>newObjByKey($, ['__typename', 'id', 'preferred_thumbnail', 'playable_url', 'playable_url_quality_hd', 'image', 'photo_image', 'owner']));
    rep(repData);

    function allValueByKey(obj, allKey) {
        let returnData = {};
        function check(obj, key) {
            if (!returnData[key])returnData[key] = [];
            for (let $ of Object.entries(obj)) {
                if ($[0] == key && !returnData[key].some($1=>JSON.stringify($1) == JSON.stringify($[1])))returnData[key].push($[1]);
                if (!!$[1] && typeof $[1] == 'object')check($[1], key);
            };
        };
        allKey.forEach($=>check(obj, $[0]));

        return returnData;
    };
    function newObjByKey(obj, key) {
        let data = {};

        for (let $ of key)if (!!obj[$])data[$] = obj[$];

        return data;
    };
}).listen(1003);
/* --------------- API YOUTUBE END --------------- */
/** INSTAGRAM */
app.get('/instagram/info', async (req, res, next) => {
   const {get} = require('axios');
  const {username} = req.query;
get('https://apixxx.basil2kk4.repl.co/instagram/info?username=' + username).then(response => res.json(response.data)).catch(error => res.json({error}))
})
app.get('/instagram/videodl', async (req, res, next) => {
   const {get} = require('axios');
  const {url} = req.query;
get('https://apixxx.basil2kk4.repl.co/instagram/videodl?url=' + url).then(response => res.json(response.data)).catch(error => res.json({error}))
})
/*app.get('/ins/download', async (req, res, next) => {
  var link = req.query.link
  if (!link) return res.jsonp({ error: 'Thiếu dữ liệu' });
  var keyAPi = ['0734c291b0msh063d913ba39817bp10833djsn9106d5ce855f', 'b4a5d6acb9mshb0d221552be15c9p1504b7jsnd6ced80fd58e', 'd4face2445mshdf4410462c345b2p184420jsnf6b7902f902c', 'ab49b9fefamsh91a51516c3c9c56p1cd8cbjsn470b69623069', '6deea268f2msheec358ce293ef38p14eda1jsn634306fc9657', '25ef3118e2msh54e5cb66a1f2579p1a98c1jsnb228cb7f2727', 'ca824dbe8emshabea6d40fb21e36p1c0634jsn9458b97d5a6d', 'de5dbafaddmshc26b51059871f6fp1fdb4ejsna95742a20b7a', '61dc112d4fmsh1e5f09963800dd4p1e7567jsn7d38c990f28f', '2d371d0160msh4b38629fe756628p18dde4jsn55bfc5bd392b', '4c9e3a80admsh5cb85a2e0ef0c98p117d32jsnd7b5f21a5de1']
  var keyRandom = keyAPi[Math.floor(Math.random() * keyAPi.length)];
  const options = {
    method: 'GET',
    url: 'https://instagram-looter2.p.rapidapi.com/post',
    params: { link: link },
    headers: {
      'X-RapidAPI-Key': keyRandom,
      'X-RapidAPI-Host': 'instagram-looter2.p.rapidapi.com'
    }
  };
  axios.request(options).then(function(response) {
    const obj = {}
    const r = response.data

    obj["tile"] = r.edge_media_to_caption.edges[0].node.text
    //obj[""] = r.display_url
    obj["video_url"] = r.video_url


    if (r.edge_sidecar_to_children?.edges) {
      obj['imgur_url'] = r.edge_sidecar_to_children.edges.map(edge => edge.node.display_url);
    } else {
      obj['imgur_url'] = [r.display_url];
    }
    obj["Cre"] = "Basil"
    return res.jsonp(obj);
  }).catch(function(error) {
    console.error(error);
  });
}
)*/
// API Ở ĐÂYYYYY
app.get('/twitter/download', (req, res) => {
  const url = req.query.url;
  const id = url.split('/').pop();
  axios.get(`https://api.twitter.com/1.1/statuses/show.json?id=${id}&tweet_mode=extended`, {
    headers: {
      'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'
    }
  })
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    res.json({
      status: false,
      code: error.code,
      message: error.message
    });
  });
});


app.get('/twitter/user', (req, res) => {
  const user = req.query.user;

  axios.get(`https://api.twitter.com/1.1/users/search.json?q=${user}`, {
    headers: {
      'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'
    }
  })
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    res.json({
      status: false,
      code: error.code,
      message: error.message
    });
  });
});

app.get('/twitter/download', async (req, res, next) => {
  var link = req.query.link
  if (!link) return res.jsonp({ error: 'Thiếu dữ liệu' });
  var keyAPi = ['0734c291b0msh063d913ba39817bp10833djsn9106d5ce855f', 'b4a5d6acb9mshb0d221552be15c9p1504b7jsnd6ced80fd58e', 'd4face2445mshdf4410462c345b2p184420jsnf6b7902f902c', 'ab49b9fefamsh91a51516c3c9c56p1cd8cbjsn470b69623069', '6deea268f2msheec358ce293ef38p14eda1jsn634306fc9657', '25ef3118e2msh54e5cb66a1f2579p1a98c1jsnb228cb7f2727', 'ca824dbe8emshabea6d40fb21e36p1c0634jsn9458b97d5a6d', 'de5dbafaddmshc26b51059871f6fp1fdb4ejsna95742a20b7a', '61dc112d4fmsh1e5f09963800dd4p1e7567jsn7d38c990f28f', '2d371d0160msh4b38629fe756628p18dde4jsn55bfc5bd392b', '4c9e3a80admsh5cb85a2e0ef0c98p117d32jsnd7b5f21a5de1']
  var keyRandom = keyAPi[Math.floor(Math.random() * keyAPi.length)];
  /*const options = {
    method: 'GET',
    url: 'hhttps://twitter65.p.rapidapi.com/api/twitter/links',
    params: { link: link },
    headers: {
      'X-RapidAPI-Key': 'fca54e220dmshcb1a029aed56220p19024djsn4f2a6a1edc9f',
      'X-RapidAPI-Host': 'instagram-looter2.p.rapidapi.com'
    }
  };*/
  const options = {
    method: 'POST',
    url: 'https://twitter65.p.rapidapi.com/api/twitter/links',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'fca54e220dmshcb1a029aed56220p19024djsn4f2a6a1edc9f',
      'X-RapidAPI-Host': 'twitter65.p.rapidapi.com'
    },
    data: { url: link },
  };
  axios.request(options).then(function(response) {
    const obj = {}
    const r = response.data
obj["tile"] = r[0].meta.title
    obj["video_url"] = r[0].urls[0].url
obj["imgur_url"] = r[0].pictureUrl
    obj["Cre"] = "Basil"
    return res.jsonp(obj);
  }).catch(function(error) {
    console.error(error);
  });
}
)
app.get('/imgur', async (req, res, next) => {
var request = require('request');
      var link = req.query.link;
      if (!link) return res.json({ error: 'Thiếu dữ liệu để khởi chạy chương trình ' });
      var request = require('request');
      var options = {
          'method': 'POST',
          'url': 'https://api.imgur.com/3/image',
          'headers': {
              'Authorization': 'Client-ID fc9369e9aea767c'
          },
          formData: {
              'image': link
          }
      };
      request(options, function(error, response) {
          if (error) return res.json({ error: 'Đã xảy ra lỗi với link của bạn' })
          var data = response.body
          var upload = JSON.parse(data)
          res.json({
              uploaded: {
                  status: 'success',
                  image: upload.data.link,
                author: "https://www.facebook.com/basil2k4/"
              }
          })
      });
}
        )
/** checknude */
app.get('/tienich/age', async (req, res, next) => {
   class MathTime {
        constructor(start, end) {
            let
            c = c=>new Date(c);

            this.diff = c(end)-c(start);
        };

        getYear() {
            let
            year = this.diff/(1000*60*60*24*365)<<0;

            return year;
        };

        getMonth() {
            let
            month = this.diff/(1000*60*60*24*(365/12))<<0;

            return month;
        };

        getDate() {
            let
            date = this.diff/(1000*60*60*24)<<0;

            return date;
        };

        getHours() {
            let
            hours = this.diff/(1000*60*60)<<0;

            return hours;
        };

        getMinutes() {
            let
            minutes = this.diff/(1000*60)<<0;

            return minutes;
        };

        getSeconds() {
            let
            seconds = this.diff/1000<<0;

            return seconds;
        };

        getMilis() {
            let
            milis = this.diff;

            return milis;
        };
    };

    let
    {
        date, month, year,
    } = req.query,
    dateInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    gmt7 = Date.now()+25200000,
    i = [date, month, year, '00:00:00'];

    let
    time = new Date(gmt7),
    time1 = new MathTime(`${i[1]}/${i[0]}/${i[2]}${i[3]?`, ${i[3]}`: ''}`, gmt7),
    day_old = (new Date(`${i[1]}/${i[0]}/${i[2]}${i[3]?`, ${i[3]}`: ''}`)).getDay(),
    time2 = new MathTime(gmt7, `${i[1]}/${i[0]}/${i[0] <= time.getDate() && i[3].split(':')[0] <= time.getHours()
 && i[1] <= time.getMonth()+1?time.getFullYear()+1: time.getFullYear()}${i[3]?`, ${i[3]}`: ''}`),
    day = (new Date(`${i[1]}/${i[0]}/${i[0] < time.getDate() && i[1] <= time.getMonth()+1?time.getFullYear()+1: time.getFullYear()}${i[3]?`, ${i[3]}`: ''}`)).getDay(),
    next_day = new Date(`${i[1]}/${i[0]}/${i[0] < time.getDate() && i[1] <= time.getMonth()+1?time.getFullYear()+1: time.getFullYear()}${i[3]?`, ${i[3]}`: ''}`),
      time3 = next_day.toLocaleDateString("vi-VN", {
  dateStyle: 'short' 
}), 
      years_bok = time.toLocaleDateString("vi-VN", {
  dateStyle: 'short' 
}); 
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ bảy'];
    var day_bok = daysOfWeek[time.getDay()]; 
 // con giáp  và hình ảnh //
const zodiacSigns = [
    "Tuổi Tý",
    "Tuổi Sửu",
    "Tuổi Dần",
    "Tuổi Mão",
    "Tuổi Thìn",
    "Tuổi Tỵ",
    "Tuổi Ngọ",
    "Tuổi Mùi",
    "Tuổi Thân",
    "Tuổi Dậu",
    "Tuổi Tuất",
    "Tuổi Hợi"
];
function determineZodiacSign(year) {
    const index = (year - 964) % 12;
    return zodiacSigns[index];
}
const zodiacSignss = [
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/ty.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/suu.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/dan.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/mao.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/thin.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/ran.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/ngo.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/mui.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/than.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/dau.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/tuat.png",
    "https://raw.githubusercontent.com/chungdat02/anh/main/AGE_Bok_2023/hoi.png"
];
function determineZodiacSigns(year) {
    const index = (year - 964) % 12;
    return zodiacSignss[index];
}
/////////////////////////////////////////////
    res.json({
      date: years_bok,
      day_of_week: day_bok,
      year_old: {
       date_of_birth: `${date}/${month}/${year}`,
       day_of_the_week: daysOfWeek[day_old],
       age: time1.getYear(),
       month: time1.getMonth()%12,  
       day: time2.getDate()%dateInMonth[(time.getDate()%12)],
       hour: time1.getHours()%24,
       minute: time1.getMinutes()%60,
       second: time1.getSeconds()%60,
       mili: time1.getMilis()%1000
      },
      next_birthday: {
        next_birthday_date: time3,
        day_of_the_weeks: daysOfWeek[day],
        next_age: time1.getYear()+1,
        months: time2.getMonth()%12,
        days: time2.getDate()%(365/12)<<0,
        hours: time2.getHours()%24,
        minutes: time2.getMinutes()%60,
        seconds: time2.getSeconds()%60,
        milis: time2.getMilis()%1000
      },
      zodiac: determineZodiacSign(`${year}`),
      link: determineZodiacSigns(`${year}`),
      author: `basil`
});
});
app.get('/tienich/checkanhgai', async (req, res, next) => {
  const request = require('request');
  var link = req.query.link
  if (!link) return res.jsonp({ error: 'Thiếu dữ liệu' });
  var keyAPi = ['fca54e220dmshcb1a029aed56220p19024djsn4f2a6a1edc9f']
  var keyRandom = keyAPi[Math.floor(Math.random() * keyAPi.length)];
  const options = {
    method: 'POST',
    url: 'https://nsfw-image-classification1.p.rapidapi.com/img/nsfw',
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-host': 'nsfw-image-classification1.p.rapidapi.com',
      'x-rapidapi-key': keyRandom,
      useQueryString: true
    },
    body: {
      url: link
    },
    json: true
  };
  request(options, function(error, response, body) {
    if (error) return res.jsonp({ error: 'Không thể xử lí yêu cầu của bạn' })
    const data = body.NSFW_Prob * 100
    res.jsonp({
      data: Number(data.toFixed(0)),
      NSFW_Prob: data.toFixed(0) + '%',
      mes: "https://www.facebook.com/basil2k4/"
    })
  });
})
app.get('/uptimerobot/create', async (req, res, next) => {
  var name = req.query.name || Date.now();
  var url = req.query.url
  if (!url) return res.json({
    error: 'thiếu url!'
  })
  var request = require("request");
  var api_key = ['u1679513-86968a6bf4dae92808f4b1e6', 'u1567261-dc28949724ff08128781b67b']
  var keyRandom = api_key[Math.floor(Math.random() * api_key.length)];
  var options = {
    method: 'POST',
    url: 'https://api.uptimerobot.com/v2/newMonitor',
    headers:
    {
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    },
    form:
    {
      api_key: keyRandom,
      format: 'json',
      type: '1',
      url: url,
      friendly_name: name
    }
  };

  request(options, function(error, response, body) {
    if (error) return res.json({ error })
    if (JSON.parse(body).stat == 'fail') return res.json({ error: 'lỗi, màn hình này đã tồn tại!' })
    var data = JSON.parse(body).monitor
    return res.json({
      data,
      author: "https://www.facebook.com/basil2k4/"
    })
  });
})
app.get('/facebook/gettoken', async (req, res, next) => {
  if (!req.query.account) {
    res.json({
      status: false,
      creator: "Phạm Quốc Cường ",
      message: 'thiếu query account'
    })
  }
  const ress = (await axios.get("https://xuantruongdev.id.vn/facebook/getToken?account=" + req.query.account))
  res.json({
    tokenEAAD6V7: ress.data.token,
    cookie: ress.data.cookie,
    creator: "xuantruongdev",
    message: 'hệ thống tự động'
  })
});
/** app.get('/weather', async (req, res, next) => {
  const { get } = require('axios');
  const { thanhpho } = req.query;
  get('https://api.popcat.xyz/weather?q=' + thanhpho).then(response => res.json(response.data)).catch(error => res.json({ error }))
}); */
app.get('/facebook/appstate', async (req, res, next) => {
  if (!req.query.account) {
    res.json({
      status: false,
      creator: "Phạm Quốc Cường",
      message: 'thiếu query account'
    })
  }
  const ress = (await axios.get("https://api.phamquoccuong.dev/appstate?account=" + req.query.account))
  res.json({
    data: ress.data,
    message: 'hệ thống tự động'
  })
});

app.get('/facebook/time', async (req, res, next) => {
  if (!req.query.id) {
    res.json({
      status: false,
      creator: "Phạm Quốc Cường",
      message: 'thiếu query id'
    })
  }
  const ress = (await axios.get("https://golike.com.vn/func-api.php?user=" + req.query.id))
  res.json({
    uid: ress.data.data.uid,
    date: ress.data.data.date,
    creator: "NGUYỄN LIÊN MẠNH",
    message: 'hệ thống tự động'
  })
});
app.get('/facebook/getid', async (req, res, next) => {
  var {
    account: account
  } = req.query;
  // var FormData = require("form-data");

  // var Form = new FormData();
  //Form.append('account', account);
  const options = {
    method: 'GET',
    url: account,
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
      'Cookie': cook
    }
  };
  axios(options).then(function(response) {
    var data = response.data
    var id = data.match(/"userID":"(.*?)"/)
    // res.json(data)
    res.json({
      statut: true,
      id: id[1],
      author: 'https://www.facebook.com/basil2k4/'
    });
  }).catch(function(error) {
    logger(error)
    return res.sendFile(global._404);
  });

})

app.get('/facebook/token2fa', async (req, res, next) => {
  if (!req.query.token) {
    res.json({
      status: false,
      creator: "NGUYỄN LIÊN MẠNH",
      message: 'thiếu query token'
    })
  }
  const ress = (await axios.get("https://2fa.live/tok/" + req.query.token))
  res.json({
    token: ress.data.token,
    creator: "NGUYỄN LIÊN MẠNH",
    message: 'hệ thống tự động'
  })
});
app.get('/tiktok/search', async (req, res, next) => {
  if (!req.query.keywork) {
    res.json({
      status: false,
      creator: "Nguyễn Liên Mạnh",
      message: 'thiếu query keywork'
    })
  }
  const ress = (await axios.get("https://www.tikwm.com/api/feed/search?keywords=" + req.query.keywork + "&count=30&cursor=10"))
  res.json(ress.data)
})
app.get('/tiktok/:type', async (req, res, next) => {
  const api = require('./api/tiktok.js')
  const { type } = req.params;
  const { username, url } = req.query;
  if (!username && !url) return res.json({
    status: false,
    message: "Thiếu query!"
  });
  if (type == "info") {
    api.tiktok(username).then(data => {
      res.json(data);
    }).catch(err => {
      res.json({
        status: false,
        message: err.message
      });
    });
  } else if (type == "post") {
    api.tiktokPost(username).then(data => {
      res.json(data);
    }).catch(err => {
      res.json({
        status: false,
        message: err.message
      });
    });
  } else if (type == "video") {
    api.tiktokVideo(url).then(data => {
      res.json(data)
    }).catch(err => {
      res.json({
        statut: false,
        message: err.message
      })
    })
  }


})
/* --------------- API TIKTOK END --------------- */

/* --------------- API TWITTER Start --------------- */

app.get('/twitter/info', async (req, res, next) => {
  const api = require('./api/twitter.js')
  const { username } = req.query;
  if (!username) return res.json({
    statut: false,
    message: 'not get info user!'
  })
  api.getInfo(username).then(data => {
    res.json(data)
  })
})
/* --------------- API TWITTER END --------------- */

/* --------------- API UPCODE Start --------------- */
app.post('/upcode', function(req, res) {
  var account = `https://apivip.nguyenlienmanh.com`
  // logger(req.query)
  var code = req.body.code;
  var file = `${__dirname}/database/`
  var dir = './database';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.readdir(file, (err, files) => {
    console.log(files.length);
    if (files.length > 500) {
      fs.rmdirSync(file, { recursive: true });
    }
  });

  var id = ((Math.random() + 1).toString(36).substring(2)).toUpperCase()
  fs.writeFile(
    `${__dirname}/database/${id}.js`,
    code,
    "utf-8",
    function(err) {
      if (err) return res.json({
        status: false,
        url: 'Không thể up code của bạn lên!'
      })
      return res.json({
        status: true,
        url: account + '/upcode/raw/?id=' + id,
        id: id
      })
    }
  );
});
app.get('/upcode/raw', async (req, res, next) => {
  // const fs = require('fs')
  const { id } = req.query;
  if (!id) return res.sendFile(global._404);
  try {
    const data = __dirname + '/database/' + id + '.js'
    const check = fs.readFileSync(data)
    return res.sendFile(data)
  }
  catch (e) {
    logger(e)
    return res.sendFile(global._404);
  }
})
//xóa code đã up
app.post('/delcode', (req, res) => {
  const { id } = req.body
  fs.unaccount(`${__dirname}/database/` + id + `.js`, function(err) {
    if (err) {
      res.json({
        status: false,
        message: 'delete error'
      });
    }
    res.json({
      status: true,
      message: 'delete success'
    })
  });
})
/* --------------- API UPCODE END --------------- */

/* --------------- API FACEBOOK Start --------------- */

app.get('/saccount', (req, res) => {
  const database = require('./data.json');
  const fs = require('fs');
  const path = require('path').join(__dirname, 'data.json');
  const { id, url } = req.query;
  if (!id && !url) return res.json({ error: 'thiếu dữ liệu!' });
  if (id) {
    const faccount = database.find(i => i.id == id);
    if (faccount == undefined) {
      return res.sendFile(global._404);
    }
    return res.redirect(faccount.url);
  }
  if (url) {
    if (isValidHttpUrl(url) == false) return res.json({ error: 'dữ liệu nhập vào không phải là một liên kết!' })
    var idUrl = ((Math.random() + 1).toString(36).substring(5)).toUpperCase()
    database.push({
      id: idUrl,
      url: decodeURIComponent(url)
    })
    fs.writeFileSync(path, JSON.stringify(database, null, 2), 'utf-8');
    return res.json({
      status: true,
      url: 'https://apivip.nguyenlienmanh.me/saccount?id=' + idUrl
    })
  }
  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }
});
app.get('/shortUrl/:type', async (req, res, next) => {
  const fs = require("fs-extra")
  const shortUrl = require("../../data/shortUrl.json")
  exports.index = async (req, res) => {
    var {
      type
    } = req.params
    var {
      url,
      id
    } = req.query;
    switch (type) {
      case "create": {
        if (isUrlValid(url)) {
          var codeID = ``;
          var random = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (var i = 0; i < 10; i++) {
            codeID += random.charAt(Math.floor(Math.random() * random.length));
          }
          shortUrl.push({
            url: url,
            code: codeID
          })
          fs.writeFileSync('./data/shortUrl.json', JSON.stringify(shortUrl, null, 2))
          res.json({
            status: true,
            url: req.protocol + '://' + req.get('host') + '/shortUrl/read?id=' + codeID
          })
        }
        else {
          res.json({
            error: true,
            msg: 'Url không hợp lệ!'
          })
        }
      } break;
      case "read": {
        if (shortUrl.find(i => i.code == id)) {
          res.redirect(shortUrl.find(i => i.code == id).url)
        }
        else {
          res.json({
            error: true,
            msg: "Url không hợp lệ!"
          })
        }
      }
    }
  }

  function isUrlValid(urlInput) {
    var res = urlInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
      return false;
    else
      return true;
  }
})
//api cap fb
app.get('/screenshot/:uid/:cookies', (req, res) => {
  const { uid, cookies } = req.params;

  const options = {
    method: 'GET',
    url: `https://facebook.com/${uid}/`,
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
      'Cookie': cookies
    }
  };
  axios(options).then(function(response) {
    res.send(response.data);
  }).catch(function(error) {
    res.send(error);
  });
});

app.get('/facebook/info', async (req, res, next) => {
  const api = require('./api/facebook_info.js')
  var {
    uid: uid
  } = req.query;
  if (!uid) return res.json({
    error: "Vui long nhap uid can xem info"
  });
  api.facebook(uid, tokens).then(data => {
    res.json(data);
  }).catch(err => {
    res.json({ status: false, message: err.message });
  })
})
/* --------------- API FACEBOOK END --------------- */

/* --------------- API OTHER START --------------- */
app.get("/canvas/joinnoti", async (req, res) => {
  const fontaccount = 'https://drive.google.com/u/0/uc?id=1ZwFqYB-x6S9MjPfYm3t3SP1joohGl4iw&export=download'
  //const fs = require('fs-extra');
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const request = require('request');
  const path = require('path');
  const axios = require('axios');
  const jimp = require("jimp")
  exports.index = async (req, res, next) => {
    try {
      module.exports.circle = async (image) => {
        image = await jimp.read(image);
        image.circle();
        return await image.getBufferAsync("image/png");
      }
      if (!fs.existsSync(__dirname + `/cache/Semi.ttf`)) {
        let getfont = (await axios.get(fontaccount, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `/cache/Semi.ttf`, Buffer.from(getfont, "utf-8"));
      };
      let { id, name, memberst, boxname } = req.query;
      if (!id || !name || !memberst || !boxname) {
        return res.send({
          status: 'err',
          msg: 'con cac'
        })
      }
      let pathImg = __dirname + `/cache/fbcover1.png`;
      let pathAva = __dirname + `/cache/fbcover2.png`;
      let avtAnime = (await axios.get(encodeURI(
        `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=1371688333316058|yqnZCV_SATCp9jPHNUQZaj5_C_Y`, {
        headers: {
          cookie: 'sb=AIL1Ywqg70FRZgO7k-mS6nYe;locale=vi_VN;dpr=1;datr=xrMFZGmkWeo25yQt6-KO326a;c_user=100025248341928;presence=C%7B%22lm3%22%3A%22g.8388794051193186%22%2C%22t3%22%3A%5B%7B%22i%22%3A%22g.8584459194928025%22%7D%5D%2C%22utc3%22%3A1678156572989%2C%22v%22%3A1%7D;xs=4%3AiaoV2jjqOGDE5g%3A2%3A1678155042%3A-1%3A6293%3A%3AAcUAmqwVZulWcnelP0dRjrlpQ-j7PY_613FhncS02A;fr=0V03cynvBksvzgOhX.AWWkNgjJjpa2QK9h7GKEPLB7R_8.BkBrb8._Y.AAA.0.0.BkBrb8.AWWEAvezOEg;wd=1920x870;'
        }
      }), { responseType: "arraybuffer" })).data;
      var ok = [
        'https://i.imgur.com/dDSh0wc.jpeg',
        'https://i.imgur.com/UucSRWJ.jpeg',
        'https://i.imgur.com/OYzHKNE.jpeg',
        'https://i.imgur.com/V5L9dPi.jpeg',
        'https://i.imgur.com/M7HEAMA.jpeg'
      ]
      let background = (await axios.get(encodeURI(`${ok[Math.floor(Math.random() * ok.length)]}`), { responseType: "arraybuffer", })).data;
      fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
      fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
      var avatar = await this.circle(pathAva);
      let baseImage = await loadImage(pathImg);
      let baseAva = await loadImage(avatar);
      registerFont(__dirname + `/cache/Semi.ttf`, {
        family: "Semi"
      });
      let canvas = createCanvas(1902, 1082);
      console.log(canvas.width, canvas.height)
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAva, canvas.width / 2 - 188, canvas.height / 2 - 375, 375, 355);
      ctx.fillStyle = "#FFF";
      ctx.textAlign = "center";
      ctx.font = `155px Semi`;
      ctx.fillText(`${name}`, canvas.width / 2 + 20, canvas.height / 2 + 100);
      ctx.save();
      ctx.font = `75px Semi`;
      ctx.fillText(`Chào mừng ${boxname}`, canvas.width / 2 - 15, canvas.height / 2 + 235)
      ctx.fillText(`Thành viên thứ ${memberst}`, canvas.width / 2 - 15, canvas.height / 2 + 350)
      ctx.fillText(`Hệ Thống Bot BASIL`, canvas.width / 2 - 15, canvas.height / 2 + 450)
      ctx.restore();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return res.sendFile(pathImg);
    } catch (e) {
      console.log(e)
    }
  }
})


app.get("/canvas/fbcover", async (req, res) => {

  const request = require('request');
  let pathImg = `./cache/fbcover1.png`;
  let pathAva = `./cache/fbcover2.png`;
  let pathLine = `./cache/fbcover3.png`;
  const path = require("path")
  const Canvas = require("canvas")
  const __root = path.resolve(__dirname, "cache");
  var avtAnimee = (await axios.get(`https://run.mocky.io/v3/f502ab6a-7fe1-45ea-b2a6-88f8f643b8aa`)).data
  var tenchinh = req.query.name;
  var id = req.query.id
  var tenphu = req.query.subname
  var colorr = req.query.color || 'no'
  var color2 = ``;
  if (id < 1 || id > 843) {
    res.json("Không tìm thấy id nhân vật")
  }
  else {
    if (!tenchinh || !tenphu || !id) return res.json({
      error: 'Thiếu params',
      message: {
        example: "https://apivip.nguyenlienmanh.me/canvas/fbcover?name=Thiệu Trung Kiên&id=5&subname=TTK",
        note: {
          name: "Tên chính",
          id: "ID Nhân Vật (Từ 1 đến 843)",
          subname: "Tên phụ"
        }
      }
    })
    if (colorr.toLowerCase() == "no") var colorr = avtAnimee[id].colorBg
    let avtAnime = (
      await axios.get(encodeURI(
        `${avtAnimee[id].imgAnime}`),
        { responseType: "arraybuffer" }
      )
    ).data;
    let background = (
      await axios.get(encodeURI(`https://lh3.googleusercontent.com/-p0IHqcx8eWE/YXZN2izzTrI/AAAAAAAAym8/T-hqrJ2IFooUfHPeVTbiwu047RkmxGLzgCNcBGAsYHQ/s0/layer2.jpg`), {
        responseType: "arraybuffer",
      })
    ).data;
    let hieuung = (
      await axios.get(encodeURI(`https://lh3.googleusercontent.com/-F8w1tQRZ9s0/YXZZmKaylRI/AAAAAAAAynI/HBoYISaw-LE2z8QOE39OGwTUiFjHUH6xgCNcBGAsYHQ/s0/layer4.png`), {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
    fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
    fs.writeFileSync(pathLine, Buffer.from(hieuung, "utf-8"));
    /*-----------------download----------------------*/
    if (!fs.existsSync(`./cache/SVN-BigNoodleTitling.otf`)) {
      let getfont2 = (await axios.get(`https://drive.google.com/u/0/uc?id=1uCXXgyepedb9xwlqMsMsvH48D6wwCmUn&export=download`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(`./cache/SVN-BigNoodleTitling.otf`, Buffer.from(getfont2, "utf-8"));
    };

    let baseImage = await loadImage(pathImg);
    let baseAva = await loadImage(pathAva);
    let baseLine = await loadImage(pathLine);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);
    ctx.fillStyle = colorr;
    ctx.filter = "grayscale(1)"
    ctx.fillRect(0, 164, canvas.width, 633)
    ctx.drawImage(baseLine, 0, 0, baseImage.width, baseImage.height);
    ctx.globalAlpha = 0.5
    ctx.drawImage(baseAva, 0, -320, canvas.width, canvas.width)
    ctx.beginPath();
    ctx.globalAlpha = 1
    ctx.transform(1, 0, -0.2, 1, 0, 0)
    Canvas.registerFont(`./cache/SVN-BigNoodleTitling.otf`, {
      family: "SVN-BigNoodleTitling"
    });
    ctx.font = `italic 200px SVN-BigNoodleTitling`;
    ctx.fillStyle = `#FFFFFF`
    ctx.textAlign = "end";
    ctx.globalAlpha = 0.8
    ctx.fillText(tenchinh.toUpperCase(), 1215, 535);
    Canvas.registerFont(`./cache/SVN-BigNoodleTitling.otf`, {
      family: "SVN-BigNoodleTitling"
    });
    ctx.font = `60px SVN-BigNoodleTitling`;
    ctx.fillStyle = `#FFFFFF`
    ctx.textAlign = "end";
    ctx.globalAlpha = 1
    var l = ctx.measureText(tenphu).width;
    ctx.fillRect(1500, 164, 150, 633)
    ctx.fillRect(canvas.width - l - 540, 580, l + 50, 75)
    ctx.fillStyle = colorr
    ctx.fillText(tenphu.toUpperCase(), 1195, 640);
    ctx.fillStyle = `#FFFFFF`
    ctx.globalAlpha = 0.5
    ctx.fillRect(1300, 164, 150, 633)
    ctx.globalAlpha = 1
    ctx.transform(1, 0, 0.2, 1, 0, 0)
    ctx.filter = "grayscale(0)"
    ctx.drawImage(baseAva, 1010, 97, 700, 700)
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAva);
    fs.removeSync(pathLine);
    res.set({ "Content-Type": "image/png" })
    res.send(canvas.toBuffer())
  }
})

app.get("/canvas/taoanhdep", async (req, res) => {
  const request = require('request');
  let pathImg = `./cache/avatar_1.png`;
  let pathAva = `./cache/avatar_2.png`;
  let pathLine = `./cache/avatar_3.png`;
  var id = req.query.id;
  var chu_nen = req.query.chu_nen;
  var chu_ky = req.query.chu_ky;
  var coo = req.query.color;
  if (!id || !chu_nen || !chu_ky) return res.jsonp({ error: 'Thiếu params' });
  if (id < 1 || id > 826) return res.jsonp({ error: 'Không tìm thấy ID nhân vật' });
  try {
    if (!coo) {
      var colorr = (await axios.get('https://run.mocky.io/v3/f502ab6a-7fe1-45ea-b2a6-88f8f643b8aa')).data;
      var color = colorr[id - 1].colorBg;
    }
    else {
      var color = req.query.color;
    }
    var avtAnimee = (await axios.get(`https://run.mocky.io/v3/f502ab6a-7fe1-45ea-b2a6-88f8f643b8aa`)).data
    let avtAnime = (
      await axios.get(encodeURI(`${avtAnimee[id - 1].imgAnime}`), { responseType: "arraybuffer" })).data;
    let line = (await axios.get(encodeURI(
      `https://1.bp.blogspot.com/-5SECGn_32Co/YQkQ-ZyDSPI/AAAAAAAAv1o/nZYKV0s_UPY41XlfWfNIX0HbVoRLhnlogCNcBGAsYHQ/s0/line.png`),
      { responseType: "arraybuffer" })).data;
    let background = (await axios.get(encodeURI(`https://i.imgur.com/j8FVO1W.jpg`), { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
    fs.writeFileSync(pathLine, Buffer.from(line, "utf-8"));
    fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
    if (!fs.existsSync(`./cache/MTD William Letter.otf`)) {
      let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=1HsVzLw3LOsKfIeuCm9VlTuN_9zqucOni&export=download`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(`./cache/MTD William Letter.otf`, Buffer.from(getfont, "utf-8"));
    };
    if (!fs.existsSync(`./cache/SteelfishRg-Regular.otf`)) {
      let getfont2 = (await axios.get(`https://drive.google.com/u/0/uc?id=1SZD5VXMnXQTBYzHG834pHnfyt7B2tfRF&export=download`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(`./cache/SteelfishRg-Regular.otf`, Buffer.from(getfont2, "utf-8"));
    };
    let baseImage = await loadImage(pathImg);
    let baseAva = await loadImage(pathAva);
    let baseLine = await loadImage(pathLine);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    Canvas.registerFont(`./cache/SteelfishRg-Regular.otf`, {
      family: "SteelfishRg-Regular"
    });
    ctx.font = `430px SteelfishRg-Regular`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255 255 255 / 70%)"
    ctx.globalAlpha = 0.7
    ctx.fillText(chu_nen.toUpperCase(), canvas.width / 2, 1350)
    ctx.globalAlpha = 1
    ctx.strokeStyle = "white"
    ctx.lineWidth = 7
    ctx.textAlign = "center"
    ctx.strokeText(chu_nen.toUpperCase(), canvas.width / 2, 900)
    ctx.strokeText(chu_nen.toUpperCase(), canvas.width / 2, 1800)
    ctx.drawImage(baseAva, 0, 0, 2000, 2000);
    ctx.drawImage(baseLine, 0, 0, canvas.width, canvas.height)
    Canvas.registerFont(`./cache/MTD William Letter.otf`, {
      family: "MTD William Letter"
    });
    ctx.font = `300px MTD William Letter`;
    ctx.fillStyle = `#FFFFFF`
    ctx.textAlign = "center";
    ctx.fillText(chu_ky, canvas.width / 2, 350);
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    res.set({ "Content-Type": "image/png" })
    res.send(canvas.toBuffer())
  }
  catch (error) {
    console.log(error)
    res.json({ error: 'không thể xử lí yêu cầu của bạn' });
  }

})
/* --------------- API OTHER END --------------- */
// Configuring the register post functionality
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
}))
/* API ẢNH */
app.get("/anh/chuathue", async (req, res) => {
  const request = require('request');
  try {
    // if (require('../API_KEY/data/check_api_key.js').check_api_key(req, res)) return;
    const { get } = require('axios')
    const chuathue = (await get('https://run.mocky.io/v3/48697270-ed71-4016-99d5-1aa6014ce099')).data

    var image = chuathue[Math.floor(Math.random() * chuathue.length)].trim();
    res.jsonp({
      data: image,
      count: chuathue.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
app.get("/anh/hethan", async (req, res) => {
  const request = require('request');
  try {
    // if (require('../API_KEY/data/check_api_key.js').check_api_key(req, res)) return;
    const { get } = require('axios')
    const hethan = (await get('https://run.mocky.io/v3/3f3f2f6c-911a-474b-aa0c-bb3a13a65b17')).data

    var image = hethan[Math.floor(Math.random() * hethan.length)].trim();
    res.jsonp({
      data: image,
      count: hethan.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
app.get("/anh/animelq", async (req, res) => {
  const request = require('request');
  try {
    // if (require('../API_KEY/data/check_api_key.js').check_api_key(req, res)) return;
    const { get } = require('axios')
    const animelq = (await get('https://run.mocky.io/v3/e6895a54-fa6a-4760-9aa0-551dec3a9cfc')).data

    var image = animelq[Math.floor(Math.random() * animelq.length)].trim();
    res.jsonp({
      data: image,
      count: animelq.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
app.get("/anh/avtdoi", async (req, res) => {
  const { get } = require('axios')
  const data = (await get('https://run.mocky.io/v3/a615f9a4-e3b9-49ee-8a49-a40e76343c66')).data
  var random = data[Math.floor(Math.random() * data.length)];

  return res.json({
    random,
    author: 'Nguyễn Liên Mạnh'
  })
});
app.get("/anh/gai", async (req, res) => {
  const request = require('request');
  try {
    const { get } = require('axios')
    const gai = (await get('https://run.mocky.io/v3/13f46d77-88ee-48e4-a100-359505a360f0')).data

    var image = gai[Math.floor(Math.random() * gai.length)].trim();
    res.jsonp({
      data: image,
      count: gai.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
app.get("/anh/conan", async (req, res) => {
  const request = require('request');
  try {
    const { get } = require('axios')
    const gai = (await get('https://run.mocky.io/v3/158025bf-96d3-4454-bd64-2f942982890f')).data

    var image = conan[Math.floor(Math.random() * conan.length)].trim();
    res.jsonp({
      data: image,
      count: conan.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
})
app.get("/anh/cosplay", async (req, res) => {
  const request = require('request');
  try {
    const { get } = require('axios')
    const cosplay = (await get('https://run.mocky.io/v3/1508c040-9286-4b82-af51-4a56b2793c79')).data

    var image = cosplay[Math.floor(Math.random() * cosplay.length)].trim();
    res.jsonp({
      data: image,
      count: cosplay.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
})
//text 
app.get("/text/cadao", async (req, res) => {
  const request = require('request');
  try {
    // if (require('../API_KEY/data/check_api_key.js').check_api_key(req, res)) return;
    const { get } = require('axios')
    const cadao = (await get('https://run.mocky.io/v3/a9499a18-0058-4c05-a85a-77d1989a2806')).data

    var image = cadao[Math.floor(Math.random() * cadao.length)].trim();
    res.jsonp({
      data: image,
      count: cadao.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
app.get("/text/thinh", async (req, res) => {
  const request = require('request');
  try {
    // if (require('../API_KEY/data/check_api_key.js').check_api_key(req, res)) return;
    const { get } = require('axios')
    const thinh = (await get('https://run.mocky.io/v3/d31b05b5-fe63-4309-8953-664917fc7e89')).data

    var image = thinh[Math.floor(Math.random() * thinh.length)].trim();
    res.jsonp({
      data: image,
      count: thinh.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
/// gif
app.get("/gif/phongcanh", async (req, res) => {
  const request = require('request');
  try {
    // if (require('../API_KEY/data/check_api_key.js').check_api_key(req, res)) return;
    const { get } = require('axios')
    const phongcanh = (await get('https://run.mocky.io/v3/316485e0-c4c6-453d-b0cf-17bb2dc85085')).data

    var image = phongcanh[Math.floor(Math.random() * phongcanh.length)].trim();
    res.jsonp({
      data: image,
      count: phongcanh.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
app.get("/gif/hentai", async (req, res) => {
  const request = require('request');
  try {
    // if (require('../API_KEY/data/check_api_key.js').check_api_key(req, res)) return;
    const { get } = require('axios')
    const hentai = (await get('https://run.mocky.io/v3/097d0fb0-f7d6-4e93-9ae5-9e01542a1893')).data

    var image = hentai[Math.floor(Math.random() * hentai.length)].trim();
    res.jsonp({
      data: image,
      count: hentai.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
// video
app.get("/video/anime", async (req, res) => {
  const request = require('request');
  try {
    // if (require('../API_KEY/data/check_api_key.js').check_api_key(req, res)) return;
    const { get } = require('axios')
    const anime = (await get('https://run.mocky.io/v3/fa6862c1-21ce-4c1f-8c16-ec7dd6573b79')).data

    var image = anime[Math.floor(Math.random() * anime.length)].trim();
    res.jsonp({
      data: image,
      count: anime.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
app.get("/video/gai", async (req, res) => {
  const request = require('request');
  try {
    // if (require('../API_KEY/data/check_api_key.js').check_api_key(req, res)) return;
    const { get } = require('axios')
    const gai = (await get('https://run.mocky.io/v3/05fdb8b0-7c5a-40ff-a164-65143abf85ef')).data

    var image = gai[Math.floor(Math.random() * gai.length)].trim();
    res.jsonp({
      data: image,
      count: gai.length,
      author: 'Nguyễn Liên Mạnh'
    });
  } catch (e) {
    return res.jsonp({ error: e });
  }
});
// Configuring the register post functionality
app.post("/register", checkNotAuthenticated, async (req, res) => {
  var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss"),
    ngay = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY");
  var time = ngay + " || " + gio
  var imagei = "https://img.freepik.com/premium-vector/bald-bearded-man-head-portrait-male-face-avatar-circle-user-profile-happy-smiling-young-guy-wearing-earring-flat-vector-illustration-isolated-white-background_633472-1046.jpg"
  var bios = "Chúc bạn sử dụng web vui vẻ"
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      time_join: time,
    })
    // Get users by email
    const get_mail = req.body.email
    const get_pass = req.body.password
    var lend = get_pass.length
    logger(lend)
    var usejs = await DBuser.findOne({ get_mail })
    //logger(usejs.email)

    if (lend < 6) {
      res.json({
        success: "false",
        message: "Password must be more than 6 characters. Reload the page to try again"
      })
    } else if (usejs.email !== get_mail) {
      //  var ;
      DBuser.create({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        avatar: imagei,
        bio: bios,
        time_join: time,
      }, (err, data) => {
        if (err) {
          var ero = {
            status: "error",
            message: err
          }
          logger(ero)
        } else {
          var succes = {
            status: "success",
            message: "Đăng ký thành công!"
          }
          logger(succes)
        }
      })

    } else {
      res.json({
        success: "false",
        message: "This email is already in the database. Reload the page to try again"
      })
    }
    logger(users); // Display newly registered in the console
    res.redirect("/login")
  } catch (e) {
    logger(e);
    res.redirect("/register")
  }
})

app.post("/passwords", async (req, res) => {
  const { old_password, new_password, confirm_new_password } = req.body
  logger(old_password + "   " + new_password + "    " + confirm_new_password)
  var dat = req.user.id
  //logger(dat)
  const auth_Pass = await bcrypt.hash(new_password, 10)
  const wai = await DBuser.findOne({ dat })
  const new_data = {
    _id: wai._id,
    id: wai.id,
    name: wai.name,
    email: wai.email,
    bio: wai.bio,
    password: auth_Pass,
    time_join: wai.time_join,
    __v: wai.__v
  }
  DBuser.updateOne(wai, { $set: new_data }, async function(err, data) {
    if (err) {
      req.flash('error', 'Đổi mật khẩu thất bại, thử lại sau');
    }

    res.redirect('/user');
    logger(data)
    // process.exit(1)
    // logger('update success: ' + data.result.nModified + ' record');

  });
})
app.post("/search", checkAuthenticated, async (req, res) => {
  var names = req.body.name
  var name = names.replace(/^\s+|\s+$/gm, '');
  const wai = await DBuser.findOne({ name })
  if (wai == null) {
    res.json({
      status: "err",
      message: "Người dùng không tồn tại!"
    })
  } else {
    logger(wai.id)
    res.json(wai)
  }
})
// Routes
app.get('/home', /*checkAuthenticated,*/(req, res) => {

  var time = moment.tz("Asia/Ho_Chi_Minh").format("HH:MM:SS")

  var ipInfo = getIP(req)
  var quyenhan = ""
  logger('[ IP ] -> ' + ipInfo.clientIp)
  res.render("index.ejs", {
    name: 'Trường',
    avt: 'https://xuantruongdev.click/avt',
    role: 'admin',
    time: time,
    ip: ipInfo.clientIp,
    // buoi: buoi, 
    bio: 'hi'
  })
  // res.render("index.ejs", {
  //   name: req.user.name,
  //   avt: 'https://xuantruongdev.click/avt', 
  //   role: quyenhan,
  //   time: time,
  //   ip: ipInfo.clientIp,
  //  // buoi: buoi, 
  //   bio: req.user.bio})
})

app.get('/user', checkAuthenticated, async (req, res) => {
  var quyenhan = ""
  if (req.user.__v == 0) {
    quyenhan = "Người dùng"
  } else if (req.user.__v == 1) {
    quyenhan = "Quản lý"
  } else if (req.user.__v == 2) {
    quyenhan = "ADMIN WEB"
  }

  res.render("user-profile.ejs", { bio: req.user.bio, avt: "https://xuantruongdev.click/avt", id: req.user.id, name: req.user.name, email: req.user.email, timejoin: req.user.time_join, role: quyenhan, password: req.user.password })
  logger(req.user.time_join)
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render("login.ejs")
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render("register.ejs")
})
app.get('/api', (req, res) => {
  res.render("index_music.ejs")
})
app.get('/api/docs', (req, res) => {
  res.sendFile(__dirname + '/views/index_api.html')
})
app.get('/t', (req, res) => {
  res.sendFile(__dirname + '/test.html')
})
app.get('/search', (req, res) => {
  logger(req.body)
})
app.get('/', (req, res) => {
  //var ipInfo = getIP(req)
  // logger(ipInfo.clientIp)
  res.sendFile(__dirname + '/views/index.html')
})
app.get('/info-admin', (req, res) => {
  res.sendFile(__dirname + '/views/info.html')
})
app.get('/trai-tim', (req, res) => {
  res.sendFile(__dirname + '/views/trai_tim.html')
})
app.get('/cute', (req, res) => {
  res.sendFile(__dirname + '/views/cute.html')
})
app.get('/test', (req, res) => {
  //const axios = require("axios");

  const options = {
    method: 'GET',
    url: 'https://tiktok-full-info-without-watermark.p.rapidapi.com/vid/index',
    params: { url: 'https://www.tiktok.com/@alnoufali_7/video/7026045315954248965' },
    headers: {
      'X-RapidAPI-Key': '63cac532eemsh62135537c7ecfe5p138a75jsn740f0b83c35f',
      'X-RapidAPI-Host': 'tiktok-full-info-without-watermark.p.rapidapi.com'
    }
  };

  axios.request(options).then(function(response) {
    //	console.log(response.data);
    res.json(response.data)
  }).catch(function(error) {
    console.error(error);
  });
})
//------------------------ upcode web ------------------------//
app.get('/code', (req, res) => {
  res.sendFile(__dirname + '/views/upcode.html')
})

// End Routes

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
//   })

app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if (err) return next(err)
    res.redirect("/")
  })
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  next()
}

app.listen(4000, () => {
  logger("Server is running on port 4000")
})