var wget = require('node-wget');
var cron = require('node-cron');
function GetLatestReleaseInfo() {
	$.getJSON("https://api.github.com/repos/ShareX/ShareX/releases/latest").done(function(release) {
		var asset = release.assets[0];
		var downloadCount = 0;
		for (var i = 0; i < release.assets.length; i++) {
		downloadCount += release.assets[i].download_count;
		}
		var oneHour = 60 * 60 * 1000;
		var oneDay = 24 * oneHour;
		var dateDiff = new Date() - new Date(asset.updated_at);
		var timeAgo;
		if (dateDiff < oneDay) {
			timeAgo = (dateDiff / oneHour).toFixed(1) + " hours ago";
		} else {
			timeAgo = (dateDiff / oneDay).toFixed(1) + " days ago";
		}
		var releaseInfo = release.name + " was updated " + timeAgo + " and downloaded " + downloadCount.toLocaleString() + " times.";
		$(".download").attr("href", asset.browser_download_url);
		$(".release-info").text(releaseInfo);
		$(".release-info").fadeIn("slow");
	});
}
cron.schedule('0 1 * * *', () => {
	wget({
			url:  'https://raw.github.com/angleman/wgetjs/master/package.json',
			dest: '/tmp/',      // destination path or path with filenname, default is ./
			timeout: 2000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
		},
		function (error, response, body) {
			if (error) {
				console.log('--- error:');
				console.log(error);            // error encountered
			} else {
				console.log('--- headers:');
				console.log(response.headers); // response headers
				console.log('--- body:');
				console.log(body);             // content of package
			}
		}
	);
});