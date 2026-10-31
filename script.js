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

