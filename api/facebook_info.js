let axios = require('axios')
let cheerio = require('cheerio')
function convert(time){
  var date = new Date(`${time}`);
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
var formattedDate = `${ day < 10 ? "0" + day : day}` + "/" +`${ month < 10 ? "0" + month : month}` + "/" + year + "||" + `${ hours < 10 ? "0" + hours : hours}` + ":" + `${ minutes < 10 ? "0" + minutes : minutes}` + ":" + `${ seconds < 10 ? "0" + seconds : seconds}`;
return formattedDate;
}
const facebook = async function (uid,tokens) {
    return new Promise(async (resolve, reject) => {
      var headers = {
  Accept: "*/*",
  Connection: "Keep-Alive",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  cookie: "c_user=100091700173408;xs=44:lal_1Owviz2GEg:2:1685881882:-1:11337;fr=0HnM0zpjpkIvIP1NS.AWVp9893DK_mZ51Db30YjB7RhRA.BkfIQZ..AAA.0.0.BkfIQZ.AWWh4u9Ngqw;datr=GYR8ZN-WqvDZu6BwrsvfsbHj;"
};
         axios({
        method: "get",
        url: `https://graph.facebook.com/v1.0/${uid}?fields=name,is_verified,created_time,cover,first_name,email,about,birthday,gender,website,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limite(0)&access_token=EAAD6V7os0gcBAOj43KI2iZA10GKvPz9Egf1DHBuIZCJKe0ChabCF4tyMF4V3OODEPYcSmA2f1s7I7IxafUaUKWClxhSnhjtIlSHXHJnFjGLZCP78PcJQO1yTdqSKFyU8Ro6SIqyobGdBT2GLwNB31rc46ku0fZBKQtcIoJHLpddQgOt2lHQB`,
       // headers: headers
      }).then(async body => {
           var name = body.data.name || "...",
          very = body.data.is_verified,
             created_time = convert(body.data.created_time),
          first_name = body.data.first_name || "...",
          username = body.data.username || "...",
          uid = body.data.id || "...",
          about = body.data.about || "...",
          follow = body.data.subscribers.summary.total_count || "private",
          birthday = body.data.birthday || "private",
          gender = body.data.gender,
          hometown = body.data.hometown,
         // hometown_id = body.data.hometown.id || null,
          link = body.data.link || "...",
          location = body.data.location,
         // location_id = body.data.location.id,
          relationship = body.data.relationship_status || "...",
          love = body.data.significant_other,
         // id_love = body.data.significant_other.id,
          quotes = body.data.quotes || "...",
          website = body.data.website || "...",
          avatar = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
     location_id = null == location ? '...' : location.id ,location = null == location ? '...' : location.name, hometown_id = null == hometown ? '...' : hometown.id ,hometown = null == hometown ? '...' : hometown.name, id_love = null == love ? 'private' : love.id ,love = null == love ? 'private' : love.name, gender = "male" == gender ? "Nam" : "female" == gender ? "Nữ" : "private"; 
      very = true == very ? 'đã xác minh' : 'chưa xác minh' ;
            resolve({
                status: 200,
           result: {
           uid: uid,
          name: name,
              created_time :  created_time,
          very: very,
          first_name: first_name,
          username: username,
          about: about,
          follow: follow,
          birthday: birthday,
          gender: gender,
          hometown: {
            name: hometown,
            id: hometown_id
          },
          link: link,
          location: {
            name: location,
            id: location_id
          },
          relationship: relationship,
          love: {
            name: love,
            id: id_love
          },
          quotes: quotes,
          website: website,
          avatar: avatar
        },
        author: "Nguyễn Liên Mạnh"
            })
        }).catch(err => {
            reject(err)
        })
    })

}

module.exports = {
  facebook
}