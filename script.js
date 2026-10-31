const lightbox = document.createElement('dialog');
lightbox.className = 'lightbox';
lightbox.setAttribute('aria-label', 'Image viewer');
lightbox.innerHTML = `
	<button class="lightbox-close" type="button" aria-label="Close image viewer">&times;</button>
	<figure>
		<img class="lightbox-image" alt="">
		<figcaption class="lightbox-caption"></figcaption>
	</figure>
`;
document.body.append(lightbox);

const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');

document.addEventListener('click', (event) => {
	const image = event.target.closest('img');
	const imageLink = event.target.closest('a[href]');
	const linkedImage = imageLink?.href.match(/\.(?:avif|gif|jpe?g|png|webp)(?:[?#]|$)/i);
	if (!image && !linkedImage) return;

	if (linkedImage) event.preventDefault();
	lightboxImage.src = image?.currentSrc || image?.src || imageLink.href;
	lightboxImage.alt = image?.alt || imageLink.textContent.trim();
	lightboxCaption.textContent = lightboxImage.alt;
	lightbox.showModal();
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
	lightbox.close();
});

lightbox.addEventListener('click', (event) => {
	if (event.target === lightbox) lightbox.close();
});

const searchForm = document.querySelector('.site-search');
const searchInput = searchForm.querySelector('input[type="search"]');
const searchResults = searchForm.querySelector('.site-search-results');
const searchPages = [
	{
		title: 'Homepage',
		href: 'index.html',
		content: "Bongi's Fast Foods serves flame-grilled burgers, golden fries, shakes, fresh meals, drive-thru, counter pickup, WhatsApp orders, rewards, vision, mission, customer reviews."
	},
	{
		title: 'About Us',
		href: 'about.html',
		content: "Our story began in 2018 in Boksburg. Meet our team, founder Bongi Ndlovu, chef Sipho Khumalo, freshness, local farms, community, values, careers, chefs, waiters, cleaners, cashiers, jobs."
	},
	{
		title: 'Our Services and Menu',
		href: 'services.html',
		content: "Drive-thru, counter pickup, event catering, call and collect, party venue, party platters, specials, burgers, chicken, sides, shakes, drinks, August menu, operating hours."
	},
	{
		title: 'Contact Us',
		href: 'contact.html',
		content: "Contact Bongi's Fast Food. Phone +27 11 765 7890, WhatsApp +27 11 456 7890, Facebook, email info@bongisfoods.com, address 21 Bass Street, Boksburg, orders, location, map."
	},
	{
		title: 'Enquiries and FAQs',
		href: 'enquiry.html',
		content: "Enquiry form, delivery, home delivery, vegetarian, vegan, careers, catering, parties, payment methods, allergens, refund policy, loyalty rewards, operating hours, opening times."
	}
];

function makeSearchSnippet(content, terms) {
	const normalizedContent = content.toLowerCase();
	const matchPositions = terms.map((term) => normalizedContent.indexOf(term));
	const firstMatch = Math.min(...matchPositions);
	const start = Math.max(0, firstMatch - 40);
	const end = Math.min(content.length, start + 140);
	return `${start > 0 ? '...' : ''}${content.slice(start, end).trim()}${end < content.length ? '...' : ''}`;
}

searchForm.addEventListener('submit', (event) => {
	event.preventDefault();
	searchResults.replaceChildren();

	const query = searchInput.value.trim().toLowerCase();
	if (!query) {
		searchResults.textContent = 'Enter a search term.';
		return;
	}

	const terms = query.split(/\s+/);
	const matches = searchPages
		.map((page) => {
			const searchableText = `${page.title} ${page.content}`.toLowerCase();
			const score = terms.reduce((total, term) => total + (page.title.toLowerCase().includes(term) ? 3 : 1), 0);
			return { ...page, searchableText, score };
		})
		.filter((page) => terms.every((term) => page.searchableText.includes(term)))
		.sort((first, second) => second.score - first.score);

	if (matches.length === 0) {
		searchResults.textContent = `No pages found for "${searchInput.value.trim()}".`;
		return;
	}

	const status = document.createElement('p');
	status.className = 'site-search-status';
	status.textContent = `${matches.length} ${matches.length === 1 ? 'page' : 'pages'} found.`;
	searchResults.append(status);

	const list = document.createElement('ul');
	list.className = 'site-search-list';
	matches.forEach((page) => {
		const item = document.createElement('li');
		const link = document.createElement('a');
		link.href = page.href;
		link.textContent = page.title;
		const excerpt = document.createElement('p');
		excerpt.textContent = makeSearchSnippet(page.content, terms);
		item.append(link, excerpt);
		list.append(item);
	});
	searchResults.append(list);
});

const orderMenu = document.querySelector('#order-menu');

if (orderMenu) {
	const products = [
		{ id: 'beef-burger', name: 'Beef Burger', category: 'Burgers', price: 45 },
		{ id: 'cheese-burger', name: 'Cheese Burger', category: 'Burgers', price: 55 },
		{ id: 'double-beef-burger', name: 'Double Beef Burger', category: 'Burgers', price: 70 },
		{ id: 'chicken-burger', name: 'Chicken Burger', category: 'Burgers', price: 50 },
		{ id: 'zinger-burger', name: 'Zinger Burger', category: 'Burgers', price: 60 },
		{ id: 'veggie-burger', name: 'Veggie Burger', category: 'Burgers', price: 45 },
		{ id: 'chicken-2-piece', name: '2 Piece Chicken & Chips', category: 'Chicken', price: 55 },
		{ id: 'chicken-4-piece', name: '4 Piece Chicken & Chips', category: 'Chicken', price: 95 },
		{ id: 'chicken-6-piece', name: '6 Piece Chicken & Chips', category: 'Chicken', price: 135 },
		{ id: 'chicken-strips', name: 'Chicken Strips (3) & Chips', category: 'Chicken', price: 55 },
		{ id: 'wings-6-chips', name: 'Wings (6) & Chips', category: 'Chicken', price: 60 },
		{ id: 'small-chips', name: 'Small Chips', category: 'Chips', price: 20 },
		{ id: 'medium-chips', name: 'Medium Chips', category: 'Chips', price: 30 },
		{ id: 'large-chips', name: 'Large Chips', category: 'Chips', price: 40 },
		{ id: 'loaded-chips', name: 'Loaded Chips', detail: 'Cheese, Russian & bacon', category: 'Chips', price: 55 },
		{ id: 'burger-meal', name: 'Burger, Chips & Can', category: 'Meals', price: 70 },
		{ id: 'zinger-meal', name: 'Zinger Burger, Chips & Can', category: 'Meals', price: 80 },
		{ id: 'chicken-meal', name: '2 Piece Chicken, Chips & Can', category: 'Meals', price: 80 },
		{ id: 'wings-meal', name: 'Wings (6), Chips & Can', category: 'Meals', price: 85 },
		{ id: 'family-meal', name: 'Family Meal', detail: '4 pieces chicken, large chips & 1.5L drink', category: 'Meals', price: 175 },
		{ id: 'roll', name: 'Roll', category: 'Extras', price: 6 },
		{ id: 'cheese-slice', name: 'Cheese Slice', category: 'Extras', price: 8 },
		{ id: 'extra-sauce', name: 'Extra Sauce', category: 'Extras', price: 5 },
		{ id: 'cooldrink-can', name: 'Cooldrink (Can)', category: 'Drinks', price: 15 },
		{ id: 'cooldrink-500ml', name: 'Cooldrink (500ml)', category: 'Drinks', price: 20 },
		{ id: 'cooldrink-1-5l', name: 'Cooldrink (1.5L)', category: 'Drinks', price: 35 },
		{ id: 'water-still', name: 'Water (Still)', category: 'Drinks', price: 12 },
		{ id: 'water-sparkling', name: 'Water (Sparkling)', category: 'Drinks', price: 15 }
	];
	const categoryMarks = {
		Burgers: '🍔',
		Chicken: '🍗',
		Chips: '🍟',
		Meals: '🍱',
		Extras: '🧀',
		Drinks: '🥤'
	};
	const menuGrid = orderMenu.querySelector('#menu-items');
	const menuSearch = orderMenu.querySelector('#menu-search');
	const menuEmpty = orderMenu.querySelector('#menu-empty');
	const basketItems = orderMenu.querySelector('#basket-items');
	const basketEmpty = orderMenu.querySelector('#basket-empty');
	const basketCount = orderMenu.querySelector('#basket-count');
	const basketTotal = orderMenu.querySelector('#basket-total');
	const clearBasketButton = orderMenu.querySelector('#clear-basket');
	const orderType = orderMenu.querySelector('#order-type');
	const deliveryAddressField = orderMenu.querySelector('#delivery-address-field');
	const orderStatus = orderMenu.querySelector('#order-status');
	const checkoutLink = orderMenu.querySelector('#whatsapp-checkout');
	const basket = new Map();
	let selectedCategory = 'All';

	function renderMenuItems() {
		const query = menuSearch.value.trim().toLowerCase();
		const visibleProducts = products.filter((product) => {
			const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
			const searchableText = `${product.name} ${product.category} ${product.detail || ''}`.toLowerCase();
			return matchesCategory && searchableText.includes(query);
		});

		menuGrid.replaceChildren();
		menuEmpty.hidden = visibleProducts.length > 0;
		visibleProducts.forEach((product) => {
			const card = document.createElement('article');
			card.className = 'menu-item';

			const cardTop = document.createElement('div');
			cardTop.className = 'menu-item-top';
			const category = document.createElement('span');
			category.className = 'menu-item-category';
			category.textContent = product.category;
			const mark = document.createElement('span');
			mark.className = 'menu-item-mark';
			mark.setAttribute('aria-hidden', 'true');
			mark.textContent = categoryMarks[product.category];
			cardTop.append(category, mark);

			const name = document.createElement('h3');
			name.textContent = product.name;
			card.append(cardTop, name);
			if (product.detail) {
				const detail = document.createElement('p');
				detail.className = 'menu-item-detail';
				detail.textContent = product.detail;
				card.append(detail);
			}

			const cardFooter = document.createElement('div');
			cardFooter.className = 'menu-item-footer';
			const price = document.createElement('strong');
			price.textContent = `R${product.price}`;
			const addButton = document.createElement('button');
			addButton.type = 'button';
			addButton.className = 'add-to-basket';
			addButton.dataset.addId = product.id;
			addButton.setAttribute('aria-label', `Add ${product.name} to basket`);
			addButton.textContent = '+ Add';
			cardFooter.append(price, addButton);
			card.append(cardFooter);
			menuGrid.append(card);
		});
	}

	function renderBasket() {
		basketItems.replaceChildren();
		let itemCount = 0;
		let subtotal = 0;
		basket.forEach((quantity, productId) => {
			const product = products.find((item) => item.id === productId);
			if (!product) return;
			itemCount += quantity;
			subtotal += product.price * quantity;

			const line = document.createElement('li');
			line.className = 'basket-line';			
			const productInfo = document.createElement('div');
			productInfo.className = 'basket-line-info';
			const productName = document.createElement('strong');
			productName.textContent = product.name;
			const linePrice = document.createElement('span');
			linePrice.textContent = `R${product.price * quantity}`;
			productInfo.append(productName, linePrice);

			const controls = document.createElement('div');
			controls.className = 'basket-line-controls';
			const decreaseButton = document.createElement('button');
			decreaseButton.type = 'button';
			decreaseButton.dataset.cartAction = 'decrease';
			decreaseButton.dataset.productId = productId;
			decreaseButton.setAttribute('aria-label', `Remove one ${product.name}`);
			decreaseButton.textContent = '−';
			const quantityLabel = document.createElement('span');
			quantityLabel.textContent = quantity;
			const increaseButton = document.createElement('button');
			increaseButton.type = 'button';
			increaseButton.dataset.cartAction = 'increase';
			increaseButton.dataset.productId = productId;
			increaseButton.setAttribute('aria-label', `Add one ${product.name}`);
			increaseButton.textContent = '+';
			controls.append(decreaseButton, quantityLabel, increaseButton);
			line.append(productInfo, controls);
			basketItems.append(line);
		});

		basketCount.textContent = itemCount;
		basketTotal.textContent = `R${subtotal}`;
		basketEmpty.hidden = itemCount > 0;
		clearBasketButton.disabled = itemCount === 0;
	}

	orderMenu.querySelector('.menu-categories').addEventListener('click', (event) => {
		const button = event.target.closest('button[data-category]');
		if (!button) return;
		selectedCategory = button.dataset.category;
		orderMenu.querySelectorAll('.menu-categories button').forEach((categoryButton) => {
			categoryButton.setAttribute('aria-pressed', categoryButton === button);
		});
		renderMenuItems();
	});

	menuSearch.addEventListener('input', renderMenuItems);
	menuGrid.addEventListener('click', (event) => {
		const button = event.target.closest('button[data-add-id]');
		if (!button) return;
		const product = products.find((item) => item.id === button.dataset.addId);
		if (!product) return;
		basket.set(product.id, (basket.get(product.id) || 0) + 1);
		renderBasket();
		orderStatus.textContent = `${product.name} added to your basket.`;
	});

	basketItems.addEventListener('click', (event) => {
		const button = event.target.closest('button[data-cart-action]');
		if (!button) return;
		const currentQuantity = basket.get(button.dataset.productId) || 0;
		if (button.dataset.cartAction === 'increase') {
			basket.set(button.dataset.productId, currentQuantity + 1);
		} else if (currentQuantity <= 1) {
			basket.delete(button.dataset.productId);
		} else {
			basket.set(button.dataset.productId, currentQuantity - 1);
		}
		renderBasket();
	});

	clearBasketButton.addEventListener('click', () => {
		basket.clear();
		renderBasket();
		orderStatus.textContent = 'Basket cleared.';
	});

	orderType.addEventListener('change', () => {
		deliveryAddressField.hidden = orderType.value !== 'Delivery';
	});

	checkoutLink.addEventListener('click', (event) => {
		if (basket.size === 0) {
			event.preventDefault();
			orderStatus.textContent = 'Add at least one menu item before reviewing your order.';
			return;
		}

		const customerName = orderMenu.querySelector('#customer-name').value.trim();
		if (!customerName) {
			event.preventDefault();
			orderStatus.textContent = 'Enter your name to continue.';
			orderMenu.querySelector('#customer-name').focus();
			return;
		}

		const deliveryAddress = orderMenu.querySelector('#delivery-address').value.trim();
		if (orderType.value === 'Delivery' && !deliveryAddress) {
			event.preventDefault();
			orderStatus.textContent = 'Enter a delivery address to continue.';
			orderMenu.querySelector('#delivery-address').focus();
			return;
		}

		const orderLines = [...basket.entries()].map(([productId, quantity]) => {
			const product = products.find((item) => item.id === productId);
			return `${quantity} x ${product.name} - R${product.price * quantity}`;
		});
		const notes = orderMenu.querySelector('#order-notes').value.trim();
		const message = [
			"Hello Bongi's Fast Foods, I'd like to place an order:",
			'',
			...orderLines,
			'',
			`Subtotal: ${basketTotal.textContent}`,
			`Order type: ${orderType.value}`,
			`Name: ${customerName}`,
			...(orderType.value === 'Delivery' ? [`Address: ${deliveryAddress}`, 'Please confirm the delivery fee.'] : []),
			...(notes ? [`Notes: ${notes}`] : [])
		].join('\n');
		checkoutLink.href = `https://wa.me/27114567890?text=${encodeURIComponent(message)}`;
		orderStatus.textContent = 'Your order draft is ready to review in WhatsApp.';
	});

	renderMenuItems();
	renderBasket();
}

document.querySelectorAll('form[action="submit_enquiry.php"]').forEach((form) => {
	form.noValidate = true;
	const fields = [...form.querySelectorAll('input:not([type="submit"]), textarea')];

	function validateField(field) {
		const value = field.value.trim();
		const digits = value.replace(/\D/g, '');
		let error = '';

		if (field.required && !value) {
			error = 'This field is required.';
		} else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			error = 'Enter a valid email address.';
		} else if (field.type === 'tel' && value && (!/^[+\d\s().-]+$/.test(value) || digits.length < 7 || digits.length > 15)) {
			error = 'Enter a valid phone number.';
		} else if (['name', 'surname'].includes(field.name) && value && !/^[\p{L}][\p{L}\s'-]*$/u.test(value)) {
			error = 'Use letters, spaces, apostrophes, or hyphens only.';
		} else if (field.tagName === 'TEXTAREA' && value.length < 10) {
			error = 'Please enter at least 10 characters.';
		}

		const errorId = `${field.id}-error`;
		let errorMessage = form.querySelector(`#${CSS.escape(errorId)}`);
		if (!errorMessage) {
			errorMessage = document.createElement('span');
			errorMessage.id = errorId;
			errorMessage.className = 'field-error';
			errorMessage.setAttribute('aria-live', 'polite');
			field.insertAdjacentElement('afterend', errorMessage);
		}

		errorMessage.textContent = error;
		field.setAttribute('aria-invalid', String(Boolean(error)));
		if (error) {
			field.setAttribute('aria-describedby', errorId);
		} else {
			field.removeAttribute('aria-describedby');
		}
		return !error;
	}

	fields.forEach((field) => {
		field.addEventListener('blur', () => validateField(field));
		field.addEventListener('input', () => {
			if (field.hasAttribute('aria-invalid')) validateField(field);
		});
	});

	form.addEventListener('submit', (event) => {
		const invalidFields = fields.filter((field) => !validateField(field));
		if (invalidFields.length) {
			event.preventDefault();
			invalidFields[0].focus();
		}
	});
});
