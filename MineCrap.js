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
function cryptobridge(coin,callback) {
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
					callback(null,original,price)
				}
			}
		}
		else {
			callback("Error reaching website!")
		}
	
	})
}
function tradeogre(coin,callback) {
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
						callback(null,original,price)
					}
				}
			}
	})
}
function minerupdate (installfile, githubapiurl, minername, install) {
	outdated=false
	var options = {
		url: githubapiurl,
		headers: {
			'User-Agent': 'MineCrap'
		}
	};
	fs.readFile('versions.json', 'utf8', function(err, contents) {
		versionjson=JSON.parse(contents)
		request(options, function (error, response, body) {
				console.log(error)
				console.log(response.statuscode)
				if (!error) {
					jsonfromwebsite = JSON.parse(body);
					console.log(jsonfromwebsite)
					if (jsonfromwebsite.tag_name!=versionjson[minername]) {
						console.log(minername + " is outdated or missing! Running installation script...")
						install(installfile, execute)
					}
	
				}
		})
	})
}
function execute (command) {
	exec(command, function(error, stdout, stderr) {
		if (error) {
			console.log(error);
		}
		else {
			console.log(stdout)
		}
	});
}
function xmrstakinstall (installfile, execution) {
	prompt.start
	prompt.get(['opencl_Y_or_N', 'cuda_Y_or_N'], function (err, result) {
		if (result.opencl_Y_or_N=="N" || result.opencl_Y_or_N=="n") {
			if (result.cuda_Y_or_N=="N" || result.cuda_Y_or_N=="n") {
				execution("sudo sh xmr-stak-compiler.sh -DCUDA_ENABLE=OFF -DOpenCL_ENABLE=OFF")
			}
			else {
				execution("sudo sh xmr-stak-compiler.sh -DOpenCL_ENABLE=OFF")
			}
		} else	
		if (result.opencl_Y_or_N=="Y" || result.opencl_Y_or_N=="y") {
			if (result.cuda_Y_or_N=="N" || result.cuda_Y_or_N=="n") {
				execution("sudo sh xmr-stak-compiler.sh -DCUDA_ENABLE=OFF")
			}
			else {
				execution("sudo sh xmr-stak-compiler.sh")
			}
		}
	})
	
}
minerupdate ("xmr-stak-compiler.sh","https://api.github.com/repos/fireice-uk/xmr-stak/releases/latest", "xmr-stak", xmrstakinstall)

