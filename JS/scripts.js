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

	$('.element').click(function() {
		$('#loader').show();
	});
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