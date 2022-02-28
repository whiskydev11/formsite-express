const express = require("express");
const app = express();
const passport = require("passport");
const { Strategy } = require("passport-discord");
const session = require("express-session");
const ejs = require("ejs");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: 98303 });

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


let strategy = new Strategy({
  clientID: "Bot ID",
  clientSecret: "Bot Client Secret",
  callbackURL: "https://SİTE ADI/callback", //developer portaldanda add redirect olarak ekleyin.
  scope: ["guilds", "identify"]
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
});

passport.use(strategy);

app.use(session({
  secret: "secret",
  resave: false,
  saveUnitialized: false
}));

app.set("view engine", "ejs")

app.get("/", function (req, res) {
        res.render("index", {
          user: req.user,
          b_client: client
        });
        
        });

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies      // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

app.use(passport.initialize());
app.use(passport.session());

app.get("/giris", passport.authenticate("discord", {
  scope: ["guilds", "identify"]
}));

app.get("/callback", passport.authenticate("discord", {
  failureRedirect: "/hata"
}), (req, res) => {
  res.redirect("/");
});

const listener = app.listen(8000, (err) => { //vsc kullanıyorsanız 3000 yapın
  
  if (err) throw err;
  client.login(process.env.TOKEN) //bot tokeni envye koyun eğer vsc
  console.log("Site 8000 portu ile açıldı.")
});

app.get("/form/:id", function (req, res) {
  if (!req.user) return res.redirect("/giris");
  let id = req.params.id;
  
  if (id === "deneme") { //form ismi bu olacak türkçe karalter kullanmayın
    
    res.render("form", {
      user: req.user,
      b_client: client,
      soru1: "Annen varmı?", //burdaki soruları değişin tabiki
      soru2: "Baban varmı?",
      soru3: "Yaşın kaç?",
      soru4: "Mezunluk durumu?",
      soru5: "Kod bilgin?",
      soru6: "Aktiflik saatin?",
      gerekli: id
    });
    
    return //eğer daha fazla form istiyorsanız üstteki mantıkla yapabilirsiniz.
  } else {
res.send("Böyle bir form yok!")
  }
});

app.post("/send", function (req, res) {
  if (!req.body) return;
  res.send("Form başarıyla gönderildi!")
  
  const embed1 = new Discord.MessageEmbed()
.setAuthor({ name: "Yeni Bir Form Geldi!", iconURL: `${client.users.cache.get(req.user.id).displayAvatarURL({ dynamic: true })}`})
.setDescription(`\n ${req.body.gerek1}: ${req.body.sorubir} \n ${req.body.gerek2}: ${req.body.soruiki} \n ${req.body.gerek3}: ${req.body.soruuc} \n ${req.body.gerek4}: ${req.body.sorudort} \n ${req.body.gerek5}: ${req.body.sorubes} \n ${req.body.gerek6}: ${req.body.sorualti} \n \n Formu Gönderen: <@${req.user.id}> | ${req.user.username}#${req.user.discriminator} \n Form ID: ${req.body.gerek}`)
.setFooter({ text: "WhiskyDev - Form", iconURL: `${client.users.cache.get(req.user.id).displayAvatarURL({ dynamic: true })}`}) 
.setTimestamp()
.setColor("GREEN")
client.channels.cache.get("LOG KANAL ID").send({ embeds: [embed1]})  

  
});