const fs = require('fs');
const request = require("request");
const exec = require('child_process').exec;
var prompt = require('prompt');
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function indexes(source, find) {
  var result = [];
  for (i = 0; i < source.length; ++i) {
    if (source.substring(i, i + find.length) == find) {
      result.push(i);
    }
  }
  return result;
}
function exchangeHandling (error, coin , price) {
  if (error) console.error('Error retrieving data : ' + error)
  else console.log('Retrieved price of ' + coin + ' : ' + price)
}
function cryptobridge (coin,callback) {
	var url = "https://api.crypto-bridge.org/api/v1/ticker"
	coin = coin.toUpperCase()
	original = coin
	coin = coin + "_BTC"
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			jsonfromwebsite = JSON.parse(body)
			for(var i = 0; i < jsonfromwebsite.length; i++) {
				currentcoin = jsonfromwebsite[i].id
				price = jsonfromwebsite[i].last
				if (currentcoin == coin) {
					return callback([original,price,"cryptobridge"])
				}
			}
		}
		else {
			return callback(new Error("Error reaching cryptobridge!"))
		}
	
	})
}
function tradeogre (coin,callback) {
	var url = "https://tradeogre.com/api/v1/markets"
	coin = coin.toUpperCase()
	original = coin
	coin = "BTC_" + coin
	console.log(coin)
	request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				body = body.replaceAll("-","_")
				jsonfromwebsite = JSON.parse(body);
				for(var i = 0; i < jsonfromwebsite.length; i++) {
					currentcoin = Object.keys(jsonfromwebsite[i])[0];
					if (currentcoin == coin) {
						price = jsonfromwebsite[i][coin].price
						return callback([original,price,"tradeogre"])
					}
				}
			}
			else {
				return callback(new Error("Error reaching tradeogre!"))
			}
	})
}
exports.getBest = function (hashrate,power,callback) {
	request("https://www.whattomine.com/coins.json?utf8=%E2%9C%93&adapt_q_380=0&adapt_q_fury=0&adapt_q_470=0&adapt_q_480=0&adapt_q_570=0&adapt_q_580=5&adapt_q_vega56=0&adapt_q_vega64=0&adapt_q_1050Ti=0&adapt_q_10606=0&adapt_q_1070=0&adapt_q_1070Ti=0&adapt_q_1080=0&adapt_q_1080Ti=0&adapt_q_2060=0&adapt_q_2070=0&adapt_q_2080=0&adapt_q_2080Ti=0&eth=true&factor%5Beth_hr%5D=" + hashrate["eth"].toString() + "&factor%5Beth_p%5D=" + power[eth].toString() "&zh=true&factor%5Bzh_hr%5D=" + hashrate["zh"].toString() + "&factor%5Bzh_p%5D=" + power["zh"].toString() + "&cns=false&factor%5Bcns_hr%5D=0.00&factor%5Bcns_p%5D=0.00&cnh=false&factor%5Bcnh_hr%5D=0.00&factor%5Bcnh_p%5D=0.00&cnhn=false&factor%5Bcnhn_hr%5D=0.00&factor%5Bcnhn_p%5D=0.00&cn8=false&factor%5Bcn8_hr%5D=0.00&factor%5Bcn8_p%5D=0.00&cnf=false&factor%5Bcnf_hr%5D=0.00&factor%5Bcnf_p%5D=0.00&eqa=true&factor%5Beqa_hr%5D=" + hashrate["144_5"].toString() + "&factor%5Beqa_p%5D=" + power["144_5"].toString() + "&cr29=true&factor%5Bcr29_hr%5D=" + hashrate["c29"].toString() + "&factor%5Bcr29_p%5D=" + power["c29"].toString() + "&ns=true&factor%5Bns_hr%5D=" + hashrate["neoscrypt"].toString() + "&factor%5Bns_p%5D=" + power["neoscrypt"].toString() + "&bcd=true&factor%5Bbcd_hr%5D=" + hashrate["bcd"].toString() + "&factor%5Bbcd_p%5D=" + power["bcd"].toString() + "&tt10=false&factor%5Btt10_hr%5D=&factor%5Btt10_p%5D=0.00&x16r=true&factor%5Bx16r_hr%5D=" + hashrate["x16r"].toString() + "&factor%5Bx16r_p%5D=" + power["x16r"].toString() + "&l2z=false&factor%5Bl2z_hr%5D=0.00&factor%5Bl2z_p%5D=0.00&phi2=false&factor%5Bphi2_hr%5D=0.00&factor%5Bphi2_p%5D=0.00&xn=false&factor%5Bxn_hr%5D=0.00&factor%5Bxn_p%5D=0.00&hx=false&factor%5Bhx_hr%5D=0.00&factor%5Bhx_p%5D=0.00&phi=false&factor%5Bphi_hr%5D=0.00&factor%5Bphi_p%5D=0.00&ppw=false&factor%5Bppw_hr%5D=0.00&factor%5Bppw_p%5D=0.00&x22i=true&factor%5Bx22i_hr%5D=" + hashrate["x22i"].toString() + "&factor%5Bx22i_p%5D=" + power["x22i"].toString() + "&mtp=false&factor%5Bmtp_hr%5D=0.00&factor%5Bmtp_p%5D=0.00&lrev3=true&factor%5Blrev3_hr%5D=" + hashrate["lyra2rev3"].toString() + "&factor%5Blrev3_p%5D=" + power["lyra2rev3"].toString() + "&factor%5Bcost%5D=0.1&sort=Profitability24&volume=0&revenue=24h&factor%5Bexchanges%5D%5B%5D=&factor%5Bexchanges%5D%5B%5D=binance&factor%5Bexchanges%5D%5B%5D=bitfinex&factor%5Bexchanges%5D%5B%5D=bittrex&factor%5Bexchanges%5D%5B%5D=cryptobridge&factor%5Bexchanges%5D%5B%5D=exmo&factor%5Bexchanges%5D%5B%5D=hitbtc&factor%5Bexchanges%5D%5B%5D=ogre&factor%5Bexchanges%5D%5B%5D=poloniex&dataset=&commit=Calculate", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			bestWTM = []
			for (var i = 0; i < 25; i++) {
				bestWTM.push(JSON.parse(body)["coins"][i]["algorithm"])
			callback(bestWTM)
		}
		else {
			callback(new Error("Error reaching WTM!"))
		};
	});
}
