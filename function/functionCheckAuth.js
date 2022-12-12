const PATH = "D:/Project/web";
const DATA = require(PATH + '/function/functionData.js');

/* 
    check token key
    @input token
    @output true/ false
    @createDate 12-12-2022
*/
module.exports = {
    checkTokenkey: async function (header) {
        try {
            if (header) {
                var tempToken = header.split(" ")
                if (Array.isArray(tempToken) && typeof tempToken[1] != "undefined") {
                    var authHead = tempToken[1];
                    var tempUser = await DATA.getUserAuth(authHead.trim());
                    if (tempUser) return tempUser;
                    else return false;
                }
            }
            return false

        } catch (error) {
            console.log(error)
            return false
        }

    }
}
