(function() {
	const form = document.querySelector('.form');
	const result = document.querySelector('.result');
	const notFound = document.querySelector('.not-found');

	const validateField = (field) => {
		let valid = true;
		if (field.value.length < 2) {
			valid = false;
			alert('Длина запроса должна быть хотя бы 2 символа!');
		}
		return valid;
	}

	form.addEventListener('submit', async(e) => {
		e.preventDefault();
		if(validateField(form.querySelector('input'))) {
			const inputsValue = Object.fromEntries(new FormData(e.target));
			const response = await fetch(`https://api.github.com/search/repositories?q=${inputsValue.search.replace(' ', '+')} in:name&per_page=10`);
			if(response.ok) {
				deleteCards();
				const data = await response.json();
				const items = data['items'];
				if(items == '') {
					notFound.innerHTML = `
						Ничего не найдено
					`
				}
				items.forEach(item => {
					result.appendChild(createCard(item));
				});
				form.querySelector('.search__input').value = '';
			} else {
				notFound.innerHTML = `
					Ничего не найдено
				`
			}
		}
	});
	const createCard = (data) => {
		const element = document.createElement('div');
		element.classList.add('result__item');
		element.innerHTML = `
			<a href="${data.html_url}" class="result__link" target='_blank'>
				${data.full_name}
				<svg>
					<use xlink:href='images/icons/sprite.svg#git'></use>
				</svg>
			</a>
			<div class='result__desc'>
				${data.description == null ? '' : data.description}
			</div>
			<div class='result__language'>
				${data.language === null ? '' : data.language}
			</div>
		`
		return element;
	}
	const deleteCards = () => {
		result.innerHTML = '';
		notFound.innerHTML = '';
	}
})()