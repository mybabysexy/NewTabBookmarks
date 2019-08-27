$(function() {
	// initiate localStorage if undefined
	if (localStorage.links == undefined) {
		localStorage.links = "[]";
	}

	// get links from localStorage
	let links = JSON.parse(localStorage.links);

	// iterate and prepend into the main div
	$.each(links, function (k, v) {
		let id = links[k]['id'];
		let icon = links[k]['icon'];
		let link = links[k]['link'];
		let name = links[k]['name'];
		addElem(id,icon, link, name);
	});

	if (localStorage.checkOutTime == undefined) {
		let checkOutTime = new Date();
		checkOutTime.setHours(0);
		checkOutTime.setMinutes(0);
		checkOutTime.setSeconds(0);
		localStorage.checkOutTime = checkOutTime;
	}

	let checkinTime = new Date(localStorage.checkinTime);
	let checkOutTime = new Date(localStorage.checkOutTime);
	if(checkOutTime.getDay() < new Date().getDay()) {
		checkinTime = new Date();
		checkinTime.setHours(0);
		checkinTime.setMinutes(0);
		checkinTime.setSeconds(0);
		localStorage.checkinTime = checkinTime;

		checkOutTime = new Date();
		checkOutTime.setHours(0);
		checkOutTime.setMinutes(0);
		checkOutTime.setSeconds(0);
		localStorage.checkOutTime = checkOutTime;
	}

	$('input[type=time]').val((checkinTime.getHours()<10?"0"+checkinTime.getHours():checkinTime.getHours())+":"+checkinTime.getMinutes());
	$('.checkoutTime').text(checkOutTime.getHours()+":"+checkOutTime.getMinutes());

	//add event listener for the Add button
	$('.addBtn').click(function () {
		const pattern = /((https?:\/\/)?[a-zA-Z0-9.]+)/gm;

		let name = $('#name').val();
		let link = $('#link').val();

		if (name.length > 0 && link.length > 0) {
			// get favicon based on most website's links
			let icon = link.match(pattern)[0] + "/favicon.ico";

			//get a random ID for this element
			let id = Math.random().toString(36).slice(2);

			let links = JSON.parse(localStorage.links);
			links.push({"id":id, "name":name, "link":link, "icon":icon});
			localStorage.links = JSON.stringify(links);
			
			addElem(id,icon, link, name);
		}
	});

	//add event listener for the Delete button
	$('.deleteElem').click(function(e) {
		e.preventDefault();

		let id = $(this).attr('elem-id');

		let links = JSON.parse(localStorage.links);
		links.pop({"id": id});
		localStorage.links = JSON.stringify(links);

		$('div [elem-id='+id+']').parent().css('transform','scale(0)');
		setTimeout(function() {
			$('div [elem-id=' + id + ']').parent().remove();
		},250);
	});

	$('#content a').click(function() {
		$('#loader').show();
	});

	$('.checkinBtn').click(function() {
		let checkinTime = $('input[type=time]').val();
		if($('input[type=time]').val() != "") {
			let checkinTimeArray = checkinTime.split(':');
			checkinTime = new Date();

			checkinTime.setHours(checkinTimeArray[0]);
			checkinTime.setMinutes(checkinTimeArray[1]);
			console.log("in:" + checkinTime);
			let checkOutTime = new Date();
			checkOutTime.setHours(0);
			checkOutTime.setMinutes(0);
			checkOutTime.setSeconds(0);

			if(checkinTime.getHours() < 9) {
				checkOutTime.setHours(checkinTime.getHours()+9);
				checkOutTime.setMinutes(checkinTime.getMinutes()+30);
			}
			else if(checkinTime.getHours() >= 9) {
				checkOutTime.setHours(18);
				checkOutTime.setMinutes(30);
			}
			localStorage.checkinTime = checkinTime;
			localStorage.checkOutTime = checkOutTime;

			$('.checkoutTime').text(checkOutTime.getHours()+":"+checkOutTime.getMinutes());
		}
	})
});

function addElem(id,icon,link,name) {
	var element = '	<a href="'+link+'">\
						<div class="element">\
							<div class="element-inside">\
								<img src="'+icon+'" class="siteIcon">\
								<div>\
									<h3>'+name+'</h3>\
								</div>\
								<a href="" class="deleteElem" elem-id="'+ id +'"></a>\
							</div>\
						</div>\
					</a>';
	$('#content').prepend(element);
}