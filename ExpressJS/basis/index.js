const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const User = require("./models/User.js");
const auth = require("registry-auth-token");

mongoose.connect("mongodb://localhost/basis", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

app.use(cookieParser());

///////////////////////////////
///////여기에 API 설계/////////
///////////////////////////////

router.post('/register', async(req, res) => {
    const { name, email, password } = req.body;

    const user = new User({ 
        name: name, 
        email: email, 
        password: password,
    });
    await user.save()
    res.send({ result: "success" })

    // user.save((err, userInfo) => {
    //     if(err) return res.json({ sucess: false, err})
    //     return res.status(200).josn({
    //         success: true
    //     })
    // });
})

router.post('/login', async(req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
            return res.json({ loginSuccess: false, message: "로그인 실패하였습니다."})
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                res.cookie("x_auth", user.token).status(200).json({ loginSuccess:true, userId: user._id })
            })
        })
    })
})

router.get('/auth', auth, async(req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role == 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

router.get('/logout', auth,async(req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) =>{
        if(err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})

///////////////////////////////
///////API 설계 끝!!/////////
///////////////////////////////


app.use("/api", bodyParser.json(), router);
app.use(express.static("assets"));

app.listen(5000, () => {
  console.log("서버 연결 완료!");
});