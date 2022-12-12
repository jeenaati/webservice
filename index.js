const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const moment = require('moment')
const port = 2443
const http = require('http').Server(app);

var CryptoJS = require("crypto-js");
const PATH = "D:/Project/web";
const DATA = require(PATH + '/function/functionData.js');
const SITE = require(PATH + '/function/functionSite.js');
const CHECKAUTH = require(PATH + '/function/functionCheckAuth.js');
const LOGGER = require(PATH + '/function/functionSaveLog');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/Register', async (req, res) => {
    try {
        var username = req.body.username
        var password = req.body.password
        var firstname = req.body.firstname
        var lastname = req.body.lastname

        var contact = req.body.contact
        var address = contact.address
        var postname = contact.postname
        var email = contact.email

        // Encrypt Token
        var tempUser = username + password + Date.now()
        var tokenKey = CryptoJS.AES.encrypt(tempUser, 'Web@T0kEn').toString();

        // Encrypt Password
        var hashPass = CryptoJS.AES.encrypt(password, 'Web@P@$$w0rd').toString();


        let date_now = new Date()
        date_now = moment(date_now).format("YYYY-MM-DD HH:mm:ss.SSS")
        let object_insert = {
            'username': username,
            'password_hash': hashPass,
            'firstname': firstname,
            'lastname': lastname,
            'address': address,
            'post_number': postname,
            'email': email,
            'auth_key': tokenKey,
            'created_by': "1000",
            'created_date': date_now.toString(),
            'updated_by': "1000",
            'updated_date': date_now.toString(),
        }

        LOGGER.saveLogger('info', JSON.stringify(object_insert));
        let createdUser = await DATA.insertUser(object_insert);
        LOGGER.saveLogger('info', JSON.stringify(createdUser));
        res.status(200).send({
            Status: 400,
            Message: "contact_type is not valid"
        });
    } catch (error) {
        console.log(error)
        return false
    }
});

app.post('/Login', async (req, res) => {
    try {


        var username = req.body.username
        var password = req.body.password

        let createdUser = await DATA.getUserProfile(username);

        var tempPass = CryptoJS.AES.decrypt(createdUser.password_hash, 'Web@P@$$w0rd');
        var decryptedData = tempPass.toString(CryptoJS.enc.Utf8);


        if (password == decryptedData) {
            LOGGER.saveLogger('info', {
                "user_id": createdUser.id,
                "key": createdUser.auth_key
            });
            res.status(200).send({
                Status: true,
                Message: {
                    "key": createdUser.auth_key
                }
            });
        } else {
            res.status(200).send({
                Status: false,
                Message: 'fail login'
            });
        }
    } catch (error) {
        console.log(error)
        return false
    }
});


app.post('/viewProfile', async (req, res) => {
    try {
        var header = req.headers.authorization || '';
        let profile = await CHECKAUTH.checkTokenkey(header);

        if (profile !== false) {
            let tempProfile = {
                "username": profile.username,
                "firstname": profile.firstname,
                "lastname": profile.lastname,
                "address": profile.address,
                "postNumber": profile.post_number,
                "email": profile.email,
                "created date": profile.created_date,
            }
            return res.status(200).send({
                Status: true,
                Profile: tempProfile
            });
        }
        return res.status(200).send({
            Status: false,
            Message: "fail"
        });

    } catch (error) {
        console.log(error)
        return res.status(200).send({
            Status: false,
            Message: "internal server error"
        });
    }
});

app.post('/viewHistory', async (req, res) => {
    try {
        var header = req.headers.authorization || '';
        let profile = await CHECKAUTH.checkTokenkey(header);

        if (profile !== false) {
            var listOrder = await DATA.getOrderHistory(profile.id)
            return res.status(200).send({
                Status: true,
                Message: listOrder
            });
        }
        return res.status(200).send({
            Status: false
        });
    } catch (error) {
        console.log(error)
        return res.status(200).send({
            Status: false,
            Message: "internal server error"
        });
    }
});

app.get('/productAll', async (req, res) => {
    try {
        let product = await DATA.getProductAll();
        res.status(200).send({
            Status: true,
            Message: product
        });
    } catch (error) {
        console.log(error)
        return res.status(200).send({
            Status: false,
            Message: "internal server error"
        });
    }
});

app.post('/productDetail', async (req, res) => {
    var id = req.body.product_id
    let detail = await DATA.getProductDetail(id);
    res.status(200).send({
        Status: true,
        Message: detail
    });
});

app.get('/getOrder', async (req, res) => {

    let product = await DATA.getProductAll();
    console.log(product);
});

app.post('/buyOrder', async (req, res) => {
    try {
        var header = req.headers.authorization || '';
        let profile = await CHECKAUTH.checkTokenkey(header);

        if (profile !== false) {
            var product = req.body.product
            let date_now = new Date()
            date_now = moment(date_now).format("YYYY-MM-DD HH:mm:ss.SSS")
            let object_insert = {
                "user_id": profile.id,
                "status": 1,
                "order_staus": await DATA.getStatus('รอชำระสินค้า'),
                'created_by': profile.id,
                'created_date': date_now.toString(),
                'updated_by': profile.id,
                'updated_date': date_now.toString(),
            }
            var order = await DATA.insertOrder(object_insert);
            var orderID = order[0]['id'];
            // console.log(order[0]['id']);
            // console.log(product);

            for (const element of product) {
                let detail = {
                    "order_id": orderID,
                    "product_id": element.product_id,
                    "count": element.count
                }
                console.log(detail);
                var orderDetail = await DATA.insertOrderDetail(detail);
                console.log(orderDetail);

            }
            res.status(200).send({
                Status: true
            });

        }
    } catch (error) {
        console.log(error)
        return res.status(200).send({
            Status: false,
            Message: "internal server error"
        });
    }
});

app.post('/cancelOrder', async (req, res) => {
    try {
        var header = req.headers.authorization || '';
        let profile = await CHECKAUTH.checkTokenkey(header);

        if (profile !== false) {
            var orderID = req.body.order_id
            let object_update = {
                "status": 0
            }
            let product = await DATA.updateOrder(object_update, orderID);
            res.status(200).send({
                Status: true
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(200).send({
            Status: false,
            Message: "internal server error"
        });
    }
});
app.post('/viewOrder', async (req, res) => {
    try {
        var header = req.headers.authorization || '';
        let profile = await CHECKAUTH.checkTokenkey(header);

        if (profile !== false) {
            var orderID = req.body.order_id
            let order = await DATA.getOrder(profile.id, orderID);
            var data = {
                'order_id': order.id,
                'status': await DATA.getStatusById(order.order_staus),
                'created_date': order.created_date
            }
            var orderList = await DATA.getOrderDetail(order.id);
            var obj = []
            var total = 0
            for (const element of orderList) {

                var detail = await DATA.getProductDetail(element.product_id)
                console.log(element.count * detail.amount);
                let tmpobj = {
                    'product_id': element.product_id,
                    'name': element.name,
                    'count': element.count,
                    'amount': element.count * detail.amount,
                }
                total += element.count * detail.amount;
                obj.push(tmpobj)
            }
            data['total'] = total
            data['orderList'] = obj
            res.status(200).send({
                Status: true,
                order: data
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(200).send({
            Status: false,
            Message: "internal server error"
        });
    }
});

http.listen(port, function () { //fix port
    console.log('listening on *:' + port);
});


