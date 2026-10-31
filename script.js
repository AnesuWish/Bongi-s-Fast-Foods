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
	const image = event.target.closest('img:not([alt="logo"])');
	if (!image) return;

	lightboxImage.src = image.currentSrc || image.src;
	lightboxImage.alt = image.alt;
	lightboxCaption.textContent = image.alt;
	lightbox.showModal();
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
	lightbox.close();
});

lightbox.addEventListener('click', (event) => {
	if (event.target === lightbox) lightbox.close();
});

