module.exports.config = {
	name: "upload",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "",
	description: "",
	commandCategory: "Tiện ích",
	usages: "getLink",
	cooldowns: 5,
	dependencies: {
		"tinyurl": ""
	}
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios')
	let { messageReply, threadID } = event;
  const { API } = global.config
	if (event.type !== "message_reply") return api.sendMessage({body:"🌸 𝗖𝗮́𝗰𝗵 𝗗𝘂̀𝗻𝗴 🌸\n━━━━━━━━━━━━━━━━\n𝟭.𝘂𝗽𝗹𝗼𝗮𝗱 𝗿𝗲𝗽𝗹𝘆 𝗻𝗵𝗮̣𝗰\n𝟮.𝘂𝗽𝗹𝗼𝗮𝗱 𝗿𝗲𝗽𝗹𝘆 𝘃𝗶𝗱𝗲𝗼 \n𝟯.𝗩𝗱: \𝘂𝗽𝗹𝗼𝗮𝗱+𝗺𝗽𝟯",
},event.threadID, event.messageID);  
	if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("→ Bạn phải reply một audio, video, ảnh nào đó", event.threadID, event.messageID);
	else {
            let num = 0
            let msg = ``
          for (var i = 0; i < messageReply.attachments.length; i++) {
			var _0xa038=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x70\x69\x76\x69\x70\x2E\x6E\x67\x75\x79\x65\x6E\x6C\x69\x65\x6E\x6D\x61\x6E\x68\x2E\x63\x6F\x6D\x2F\x75\x70\x6C\x6F\x61\x64\x73","\x75\x72\x6C","\x61\x74\x74\x61\x63\x68\x6D\x65\x6E\x74\x73","\x70\x6F\x73\x74"];var shortLink= await axios[_0xa038[3]](_0xa038[0],{url:messageReply[_0xa038[2]][i][_0xa038[1]]})
            //api.sendMessage(messageReply.attachments[i].url,threadID);
				num +=1;
        msg += `"${shortLink.data.url}",\n`;
    	}
        api.sendMessage(msg,threadID);
        }
}