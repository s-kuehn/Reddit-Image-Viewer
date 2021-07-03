const searchBox = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
const resultSection = document.querySelector('.results-div');

const autoScrollSelector = document.querySelector('#auto-scroll-selector');

const html = document.querySelector('html');

let after = '';

const speed = 10000;

function autoScroller() {
    console.log('Start Auto Scrolling!!!');
    if (autoScrollSelector.checked) {
        $('html').animate({scrollTop: html.scrollTop + 1000}, speed, 'linear');
    }
}


function search(url) {

    const jsonUrl = `https://www.reddit.com/r/${searchBox.value}.json`

    fetch(`${jsonUrl}?after=${after}`)
        .then(response => response.json())
        .then(body => {

            console.log(body);

            after = body.data.after;
            for (let i = 0; i < body.data.children.length; i++) {
                if (body.data.children[i].data.post_hint === 'image') {
                    const div = document.createElement('div');
                    const h4 = document.createElement('h4');
                    const image = document.createElement('img');

                    console.log(body.data.children[i].data.url_overridden_by_dest)

                    image.src = body.data.children[i].data.url_overridden_by_dest;

                    // Limit title text to 50 chars
                    if (body.data.children[i].data.title.length > 50) {
                        const titlePreview = body.data.children[i].data.title.substr(0, 50) + '...';
                        h4.textContent = titlePreview;
                    } else {
                        h4.textContent = body.data.children[i].data.title;
                    }

                    div.appendChild(h4);
                    div.appendChild(image);

                    image.classList.add('content-image');
                    div.classList.add('result-container');

                    resultSection.appendChild(div);


                }
            }
        });

    // searchBox.value = '';
}

// resultSection.textContent = '';

const jsonUrl = `https://www.reddit.com/r/${searchBox.value}.json`

searchBtn.addEventListener('click', () => {
    resultSection.textContent = '';
    setTimeout(() => {
        after = '';
        search(jsonUrl);
    }, 600);
});

searchBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        resultSection.textContent = '';

        setTimeout(() => {
            after = '';
            search(jsonUrl);
        }, 1000);
    }
});

searchBox.addEventListener('click', () => {
    searchBox.value = '';
});


document.addEventListener('scroll', () => {
    console.log(html.scrollHeight, html.scrollTop);
    // console.log((html.scrollHeight - html.scrollTop - html.clientHeight))
    if (html.scrollHeight - html.scrollTop - html.clientHeight < 1) {
        search(jsonUrl);
    }
});


function scrollStop (callback, refresh = 66) {

	// Make sure a valid callback was provided
	if (!callback || typeof callback !== 'function') return;

	// Setup scrolling variable
	let isScrolling;

	// Listen for scroll events
	window.addEventListener('scroll', function (event) {

		// Clear our timeout throughout the scroll
		window.clearTimeout(isScrolling);

		// Set a timeout to run after scrolling ends
		isScrolling = setTimeout(callback, refresh);

	}, false);

}

scrollStop(function () {
    if (autoScrollSelector.checked) {
        autoScroller();
        // setTimeout(() => {
        //     // autoScroller();
        // }, 800);
    }
});

autoScrollSelector.addEventListener('click', () => {
    if (autoScrollSelector.checked) {
        autoScroller();

    } else {
        console.log('Stop Auto Scrolling!!!');
        $(html).stop(true,false);
    }
});