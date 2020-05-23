const URLS = {
	randomJokeQuery: 'https://api.chucknorris.io/jokes/random',
	categoryJokeQuery: 'https://api.chucknorris.io/jokes/random?category=',
	searchJokeQuery: 'https://api.chucknorris.io/jokes/search?query=',
	categoriesListQuery: 'https://api.chucknorris.io/jokes/categories',
}

let body = document.querySelector('body'),
	asideContent = document.querySelector('.aside__jokes'),
	radioButtons = document.querySelector('.buttons-list'),
	categoriesOption = document.getElementById('categories-option'),
	searchOption = document.getElementById('search-option'),
	randomOption = document.getElementById('random-option'),
	section = document.querySelector('.section'),
	aside = document.querySelector('.aside'),
	blackout = document.querySelector('.blackout'),
	sectionJokes = document.querySelector('.section__jokes'),
	searchField = document.querySelector('.search__field'),
	getButton = document.querySelector('.getButton');

function formJokesQueryURL() {
	event.preventDefault();
let buttonClicked = document.querySelector('.category__button.clicked');

if(categoriesOption.checked && !buttonClicked) createErrorMessage("Choose a category, please\n");

if(randomOption.checked || buttonClicked || searchField.value.trim().length >= 3) {
	let url = categoriesOption.checked ? URLS.categoryJokeQuery + buttonClicked.innerHTML
	: searchOption.checked ? URLS.searchJokeQuery + searchField.value 
	: URLS.randomJokeQuery;

	return url;
}
if(searchField.value.trim().length < 3){
	searchField.classList.add('wrong');
	searchField.setAttribute(["placeholder"], "Enter 3 or more letters, please")
	return;
}
}

function toggleLoading() {
	let loader = document.querySelector('.loader');
	loader.classList.toggle('visible');
}
function getJokes(url) {
	getButton.disabled = true;

	if(url) {
		toggleLoading();

		fetch(url)
		.then(response => {
			if(response.ok) {
				return response.json();
			}
			throw new Error(("OOPS - Incorrect search query.\n"));
		})
		.then(data => {
			console.log(data)
			if(data.total == undefined) {
				createJokeCard(data);
				toggleLoading();
			}
			if(data.total === 0) {
				throw new Error('OOPS - We can`t find any joke with such word\n');
			}
			if(data.total > 0) {
				createJokeCard(data.result[chooseRandomJoke(data.total - 1)]);
				toggleLoading();
			}
			getButton.disabled = false;
		})
		.catch((error) => {
			toggleLoading();
			createErrorMessage(error);
			console.log(error);
			getButton.disabled = false;
		})
	} else {
		getButton.disabled = false;
		return;
	}
	
}

function createErrorMessage(error) {
	let errDiv = document.createElement('div');
	errDiv.className = 'error-message';
	errDiv.innerText = error;

	body.insertAdjacentElement('afterbegin', errDiv);

}

function getCategoriesList() {
	let url = URLS.categoriesListQuery;

	toggleLoading();

	fetch(url)
	.then(response => {
		if(response.ok) {
			return response.json();
		}
		createErrorMessage("OOPS - Error!\n Misterious error executed\n");
	})
	.then(data => {
		data.reverse().forEach(category => {
			document.querySelector('.categories').insertAdjacentHTML('afterbegin',
			`<button class="category__button">${category}</button>`
		)})
		toggleLoading();
	})
	.catch((error) => {
		toggleLoading();
		createErrorMessage('OOPS!\nTroubles with your internet connection - check it!\n');
		console.log(error);
	})

	categoriesOption.removeEventListener('click', getCategoriesList);
} 

function createFavoriteCard(card) {
	const { id, text, updated_at } = card;

	asideContent.insertAdjacentHTML('beforeend',
	`
	<div class="joke__card liked" data-update="${updated_at}" data-id="${id}">
		<div class="card__like">
			<svg class="card__unlike" width="20" height="17" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg">
		<path d="M10 17C9.71527 17 9.44077 16.9015 9.22684 16.7224C8.41888 16.0475 7.63992 15.4132 6.95267 14.8536L6.94916 14.8507C4.93423 13.2102 3.19427 11.7935 1.98364 10.3979C0.630341 8.83778 0 7.35852 0 5.74252C0 4.17244 0.563507 2.72395 1.58661 1.66367C2.62192 0.590857 4.04251 0 5.58716 0C6.74164 0 7.79892 0.348712 8.72955 1.03637C9.19922 1.38348 9.62494 1.80829 10 2.3038C10.3752 1.80829 10.8008 1.38348 11.2706 1.03637C12.2012 0.348712 13.2585 0 14.413 0C15.9575 0 17.3782 0.590857 18.4135 1.66367C19.4366 2.72395 20 4.17244 20 5.74252C20 7.35852 19.3698 8.83778 18.0165 10.3978C16.8059 11.7935 15.0661 13.2101 13.0515 14.8504C12.363 15.4108 11.5828 16.0461 10.773 16.7227C10.5592 16.9015 10.2846 17 10 17ZM5.58716 1.11932C4.37363 1.11932 3.25882 1.58203 2.44781 2.42232C1.62476 3.2753 1.17142 4.45439 1.17142 5.74252C1.17142 7.10165 1.70013 8.31719 2.88559 9.68375C4.03137 11.0047 5.73563 12.3923 7.70889 13.9989L7.71255 14.0018C8.4024 14.5635 9.18442 15.2003 9.99832 15.8802C10.8171 15.199 11.6003 14.5612 12.2916 13.9986C14.2647 12.392 15.9688 11.0047 17.1146 9.68375C18.2999 8.31719 18.8286 7.10165 18.8286 5.74252C18.8286 4.45439 18.3752 3.2753 17.5522 2.42232C16.7413 1.58203 15.6264 1.11932 14.413 1.11932C13.524 1.11932 12.7078 1.38931 11.9872 1.92171C11.3449 2.39637 10.8975 2.99642 10.6352 3.41627C10.5003 3.63217 10.2629 3.76105 10 3.76105C9.73709 3.76105 9.49966 3.63217 9.36478 3.41627C9.10263 2.99642 8.65524 2.39637 8.01285 1.92171C7.29218 1.38931 6.47598 1.11932 5.58716 1.11932Z" />
		</svg>

		<svg class="card__heart" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M18.4134 1.66367C17.3781 0.590857 15.9575 0 14.413 0C13.2585 0 12.2012 0.348712 11.2704 1.03637C10.8008 1.38348 10.3752 1.80814 10 2.3038C9.62494 1.80829 9.19922 1.38348 8.7294 1.03637C7.79877 0.348712 6.74149 0 5.58701 0C4.04251 0 2.62177 0.590857 1.58646 1.66367C0.563507 2.72395 0 4.17244 0 5.74252C0 7.35852 0.630341 8.83778 1.98364 10.3979C3.19427 11.7935 4.93423 13.2102 6.94916 14.8507C7.63718 15.411 8.41705 16.046 9.22684 16.7224C9.44077 16.9015 9.71527 17 10 17C10.2846 17 10.5592 16.9015 10.7729 16.7227C11.5826 16.0461 12.363 15.4108 13.0513 14.8503C15.0659 13.2101 16.8059 11.7935 18.0165 10.3978C19.3698 8.83778 20 7.35852 20 5.74238C20 4.17244 19.4365 2.72395 18.4134 1.66367Z"/>
		</svg> 
		</div>
		<div class="card__content">
			<div class="card__comment">
				<svg class="comment__svg" width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M17.2504 0H2.74963C1.23352 0 0 1.23328 0 2.74963V11.6238C0 13.1367 1.22815 14.368 2.73987 14.3734V18.4004L8.5271 14.3734H17.2504C18.7665 14.3734 20 13.1399 20 11.6238V2.74963C20 1.23328 18.7665 0 17.2504 0ZM18.8281 11.6238C18.8281 12.4937 18.1204 13.2015 17.2504 13.2015H8.15942L3.91174 16.1573V13.2015H2.74963C1.87964 13.2015 1.17188 12.4937 1.17188 11.6238V2.74963C1.17188 1.87952 1.87964 1.17188 2.74963 1.17188H17.2504C18.1204 1.17188 18.8281 1.87952 18.8281 2.74963V11.6238Z"/>
						<path d="M5.35291 4.14075H14.6471V5.31262H5.35291V4.14075Z"/>
						<path d="M5.35291 6.64075H14.6471V7.81262H5.35291V6.64075Z"/>
						<path d="M5.35291 9.14075H14.6471V10.3126H5.35291V9.14075Z"/>
				</svg>
			</div>
			<div class="card__text">
				<div class="card__identifier">ID: <a href="https://api.chucknorris.io/jokes/${id}" class="link__identifier">
					${id}
					<svg class="link__svg" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9.54545 0H5.90909C5.65806 0 5.45454 0.203515 5.45454 0.45455C5.45454 0.705585 5.65806 0.9091 5.90909 0.9091H8.44809L3.76952 5.58768C3.59204 5.76516 3.59204 6.05298 3.76952 6.2305C3.85825 6.31923 3.97458 6.36362 4.09091 6.36362C4.20724 6.36362 4.32359 6.31923 4.4123 6.23048L9.09092 1.55191V4.09091C9.09092 4.34194 9.29444 4.54546 9.54547 4.54546C9.7965 4.54546 10 4.34194 10 4.09091V0.45455C10 0.203515 9.79648 0 9.54545 0Z"/>
						<path d="M7.72725 4.54544C7.47622 4.54544 7.2727 4.74895 7.2727 4.99999V9.0909H0.90908V2.72726H4.99999C5.25103 2.72726 5.45454 2.52374 5.45454 2.27271C5.45454 2.02167 5.25103 1.81818 4.99999 1.81818H0.45455C0.203515 1.81818 0 2.02169 0 2.27273V9.54545C0 9.79646 0.203515 9.99998 0.45455 9.99998H7.72727C7.97831 9.99998 8.18182 9.79646 8.18182 9.54543V4.99999C8.1818 4.74895 7.97829 4.54544 7.72725 4.54544Z"/>
						</svg>
						</a>
					</div>
				<div class="card__joke">
				${text}
				<div class="card__bottom">
					<div class="card__updated">Last update:  ${getHoursDiff(new Date(updated_at))}</div>
			</div>
		</div>
	</div>
	`
	);
}

function createJokeCard(card) { 
	const { id, value, updated_at, categories } = card;

	document.querySelector('.section__jokes').insertAdjacentHTML('afterbegin',
			 `<div class="joke__card" data-update="${updated_at}" data-id="${id}">
				<div class="card__like">
					<svg class="card__unlike" width="20" height="17" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg">
				<path d="M10 17C9.71527 17 9.44077 16.9015 9.22684 16.7224C8.41888 16.0475 7.63992 15.4132 6.95267 14.8536L6.94916 14.8507C4.93423 13.2102 3.19427 11.7935 1.98364 10.3979C0.630341 8.83778 0 7.35852 0 5.74252C0 4.17244 0.563507 2.72395 1.58661 1.66367C2.62192 0.590857 4.04251 0 5.58716 0C6.74164 0 7.79892 0.348712 8.72955 1.03637C9.19922 1.38348 9.62494 1.80829 10 2.3038C10.3752 1.80829 10.8008 1.38348 11.2706 1.03637C12.2012 0.348712 13.2585 0 14.413 0C15.9575 0 17.3782 0.590857 18.4135 1.66367C19.4366 2.72395 20 4.17244 20 5.74252C20 7.35852 19.3698 8.83778 18.0165 10.3978C16.8059 11.7935 15.0661 13.2101 13.0515 14.8504C12.363 15.4108 11.5828 16.0461 10.773 16.7227C10.5592 16.9015 10.2846 17 10 17ZM5.58716 1.11932C4.37363 1.11932 3.25882 1.58203 2.44781 2.42232C1.62476 3.2753 1.17142 4.45439 1.17142 5.74252C1.17142 7.10165 1.70013 8.31719 2.88559 9.68375C4.03137 11.0047 5.73563 12.3923 7.70889 13.9989L7.71255 14.0018C8.4024 14.5635 9.18442 15.2003 9.99832 15.8802C10.8171 15.199 11.6003 14.5612 12.2916 13.9986C14.2647 12.392 15.9688 11.0047 17.1146 9.68375C18.2999 8.31719 18.8286 7.10165 18.8286 5.74252C18.8286 4.45439 18.3752 3.2753 17.5522 2.42232C16.7413 1.58203 15.6264 1.11932 14.413 1.11932C13.524 1.11932 12.7078 1.38931 11.9872 1.92171C11.3449 2.39637 10.8975 2.99642 10.6352 3.41627C10.5003 3.63217 10.2629 3.76105 10 3.76105C9.73709 3.76105 9.49966 3.63217 9.36478 3.41627C9.10263 2.99642 8.65524 2.39637 8.01285 1.92171C7.29218 1.38931 6.47598 1.11932 5.58716 1.11932Z" />
				</svg>
				
				<svg class="card__heart" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18.4134 1.66367C17.3781 0.590857 15.9575 0 14.413 0C13.2585 0 12.2012 0.348712 11.2704 1.03637C10.8008 1.38348 10.3752 1.80814 10 2.3038C9.62494 1.80829 9.19922 1.38348 8.7294 1.03637C7.79877 0.348712 6.74149 0 5.58701 0C4.04251 0 2.62177 0.590857 1.58646 1.66367C0.563507 2.72395 0 4.17244 0 5.74252C0 7.35852 0.630341 8.83778 1.98364 10.3979C3.19427 11.7935 4.93423 13.2102 6.94916 14.8507C7.63718 15.411 8.41705 16.046 9.22684 16.7224C9.44077 16.9015 9.71527 17 10 17C10.2846 17 10.5592 16.9015 10.7729 16.7227C11.5826 16.0461 12.363 15.4108 13.0513 14.8503C15.0659 13.2101 16.8059 11.7935 18.0165 10.3978C19.3698 8.83778 20 7.35852 20 5.74238C20 4.17244 19.4365 2.72395 18.4134 1.66367Z"/>
					</svg> 
				</div>
				<div class="card__content">
					<div class="card__comment">
						<svg class="comment__svg" width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M17.2504 0H2.74963C1.23352 0 0 1.23328 0 2.74963V11.6238C0 13.1367 1.22815 14.368 2.73987 14.3734V18.4004L8.5271 14.3734H17.2504C18.7665 14.3734 20 13.1399 20 11.6238V2.74963C20 1.23328 18.7665 0 17.2504 0ZM18.8281 11.6238C18.8281 12.4937 18.1204 13.2015 17.2504 13.2015H8.15942L3.91174 16.1573V13.2015H2.74963C1.87964 13.2015 1.17188 12.4937 1.17188 11.6238V2.74963C1.17188 1.87952 1.87964 1.17188 2.74963 1.17188H17.2504C18.1204 1.17188 18.8281 1.87952 18.8281 2.74963V11.6238Z"/>
							<path d="M5.35291 4.14075H14.6471V5.31262H5.35291V4.14075Z"/>
							<path d="M5.35291 6.64075H14.6471V7.81262H5.35291V6.64075Z"/>
							<path d="M5.35291 9.14075H14.6471V10.3126H5.35291V9.14075Z"/>
					</svg>
				</div>
				<div class="card__text">
					<div class="card__identifier">ID: <a href="https://api.chucknorris.io/jokes/${id}" class="link__identifier">
						${id}
						<svg class="link__svg" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M9.54545 0H5.90909C5.65806 0 5.45454 0.203515 5.45454 0.45455C5.45454 0.705585 5.65806 0.9091 5.90909 0.9091H8.44809L3.76952 5.58768C3.59204 5.76516 3.59204 6.05298 3.76952 6.2305C3.85825 6.31923 3.97458 6.36362 4.09091 6.36362C4.20724 6.36362 4.32359 6.31923 4.4123 6.23048L9.09092 1.55191V4.09091C9.09092 4.34194 9.29444 4.54546 9.54547 4.54546C9.7965 4.54546 10 4.34194 10 4.09091V0.45455C10 0.203515 9.79648 0 9.54545 0Z"/>
							<path d="M7.72725 4.54544C7.47622 4.54544 7.2727 4.74895 7.2727 4.99999V9.0909H0.90908V2.72726H4.99999C5.25103 2.72726 5.45454 2.52374 5.45454 2.27271C5.45454 2.02167 5.25103 1.81818 4.99999 1.81818H0.45455C0.203515 1.81818 0 2.02169 0 2.27273V9.54545C0 9.79646 0.203515 9.99998 0.45455 9.99998H7.72727C7.97831 9.99998 8.18182 9.79646 8.18182 9.54543V4.99999C8.1818 4.74895 7.97829 4.54544 7.72725 4.54544Z"/>
							</svg>
							</a>
						</div>
					<div class="card__joke">
						${value}
					</div>
					<div class="card__bottom">
						<div class="card__updated">Last update:  ${getHoursDiff(new Date(updated_at))} hours ago</div>
						${categories.length > 0 ? `<div class="card__category">${categories}</div>` : '' }
					</div>
				</div>
				</div>
			</div>`
	)
}

function getHoursDiff(date) {
	let diff =(date.getTime() - new Date().getTime()) / 1000;
	diff /= (60 * 60);
	
	return Math.abs(Math.round(diff));
}

function toggleAside() {
	let sectionProperty = section.style.overflowY;
	sectionProperty === 'hidden' ? sectionProp = 'scroll' : 'hidden';
	blackout.classList.toggle('blackout_visible');
	aside.classList.toggle('aside_visible');
}

if (localStorage.getItem('favourites') === null) {
	var favouriteJokes = {};
	localStorage.setItem('favourites', JSON.stringify(favouriteJokes));
} else {
	var favouriteJokes = JSON.parse(localStorage.getItem('favourites'));

	for(let id in favouriteJokes) {
		createFavoriteCard(favouriteJokes[id]);
	};
}

function chooseRandomJoke(maxIndex) {
	return Math.floor(Math.random() * (maxIndex + 1));
}

document.addEventListener('click', (event) => {
	console.log(event.target)
	let card = event.target.closest('.joke__card');

	if (!card) return;

	let cardId = card.dataset.id;

	if(cardId in favouriteJokes) {
		asideContent.querySelector(`[data-id="${cardId}"]`).remove();

		document.querySelectorAll(`[data-id="${cardId}"]`).forEach(card => {
			card.classList.remove('liked');
		})

		delete favouriteJokes[cardId];
		localStorage.setItem('favourites', JSON.stringify(favouriteJokes));
	} else {
		favouriteJokes[cardId] = {
			id: cardId,
			text: card.querySelector('.card__joke').innerText,
			updated_at: card.dataset.update,
		};
	
		localStorage.setItem('favourites', JSON.stringify(favouriteJokes));
	
		card.classList.toggle('liked')
		asideContent.prepend(event.target.closest('.joke__card').cloneNode(true));
	}}
)




document.addEventListener('click', () => {
	if (!event.target.closest('.aside-toggler') && !event.target.matches('.blackout')) return;

	toggleAside();
})

document.addEventListener('click', event => {
	if (!event.target.matches('.category__button')) return;

	let categories = document.querySelector('.categories');
	let elems = categories.children;

	[].forEach.call(elems, el => {
	    el.classList.remove("clicked");
	});

	event.target.classList.add('clicked');
});

document.addEventListener('change', event => {
	if(!event.target.matches('.buttons-list') === null) return;

	radioButtons.classList.toggle('buttons-list_categories', categoriesOption.checked);
	radioButtons.classList.toggle('buttons-list_search', searchOption.checked)
})

document.addEventListener('input', (event) => {
	let target = event.target;

	if(!target.matches('.search__field')) return;

	if(target.value.length >= 3) {
		target.classList.remove('wrong');
	}
}) 

document.addEventListener('click', () => {
	if(!event.target.matches('.getButton')) return;

	getJokes(formJokesQueryURL());
})

searchField.addEventListener("keyup", event => {
	if(event.key !== "Enter") return;
	
  	getButton.click();
    event.preventDefault();
});

categoriesOption.addEventListener('click', getCategoriesList);

document.addEventListener('animationend', () => {
	if(event.target.matches('.error-message')) {
		document.querySelectorAll('.error-message').forEach(er => er.remove());
	}
})


