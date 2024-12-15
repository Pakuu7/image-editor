const image = document.querySelector('.editor__image-random')
const rotateLeftBtn = document.querySelector('.editor__option--left')
const rotateRightBtn = document.querySelector('.editor__option--right')
const horizontalFlipBtn = document.querySelector('.editor__option--horizontal')
const verticalFlipBtn = document.querySelector('.editor__option--vertical')
const filterButtonAll = document.querySelectorAll('.editor__filter-button')
const scrollbarTitle = document.querySelector('.editor__scrollbar-title')
const scrollbarValue = document.querySelector('.editor__scrollbar-value')
const scrollbar = document.querySelector('.editor__scrollbar-slider')
const resetFiltersBtn = document.querySelector('.editor__general-option--reset')
const chooseImgBtn = document.querySelector('.editor__general-option--choose')
const fileInput = document.querySelector('.editor__general-option--file')
const saveImgBtn = document.querySelector('.editor__general-option--save')
const canvas = document.querySelector('.editor__canvas')
const ctx = canvas.getContext('2d')

let activeFilter = ''

const filters = {
	brightness: 100,
	saturation: 100,
	inversion: 0,
	grayscale: 0,
}

chooseImgBtn.addEventListener('click', () => fileInput.click())

fileInput.addEventListener('change', () => {
	const file = fileInput.files[0]

	if (file) {
		const reader = new FileReader()

		reader.onload = event => {
			image.src = event.target.result

			image.onload = () => {
				canvas.width = image.naturalWidth
				canvas.height = image.naturalHeight

				ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
			}
		}
		reader.readAsDataURL(file)
	}
})

function setCurrentFilter() {
	activeFilter = 'brightness'
	scrollbarValue.textContent = filters[activeFilter]
	filterButtonAll.forEach(filter => {
		filter.addEventListener('click', () => {
			activeFilter = filter.textContent.toLocaleLowerCase()
			scrollbarTitle.textContent = filter.textContent
			scrollbar.value = filters[activeFilter]
			scrollbarValue.textContent = filters[activeFilter]
			updateImageFilter()
		})
	})
}

function updateImageFilter() {
	image.style.filter = `
    brightness(${filters.brightness}%) 
    saturate(${filters.saturation}%) 
    invert(${filters.inversion}%) 
    grayscale(${filters.grayscale}%)
    `
}

function scrollBarUpdate() {
	scrollbar.addEventListener('input', () => {
		filters[activeFilter] = scrollbar.value
		scrollbarValue.textContent = scrollbar.value
		updateImageFilter()
	})
}

resetFiltersBtn.addEventListener('click', () => {
	filters['brightness'] = 100
	filters['saturation'] = 100
	filters['inversion'] = 0
	filters['grayscale'] = 0
	scrollbar.value = filters[activeFilter]
	scrollbarValue.textContent = filters[activeFilter]
	updateImageFilter()
})

saveImgBtn.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const rotation = parseInt(image.dataset.rotation || 0)
	const flipX = image.style.transform.includes('scaleX(-1)') ? -1 : 1
	const flipY = image.style.transform.includes('scaleY(-1)') ? -1 : 1

	ctx.filter = `
		brightness(${filters.brightness}%)
        saturate(${filters.saturation}%)
        invert(${filters.inversion}%)
        grayscale(${filters.grayscale}%)
	`

	ctx.save()
	ctx.translate(canvas.width / 2, canvas.height / 2)
	ctx.scale(flipX, flipY)
	ctx.rotate((rotation * Math.PI) / 180)
	ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
	ctx.restore()

	const imageURL = canvas.toDataURL('image/png')
	const link = document.createElement('a')
	link.href = imageURL
	link.download = 'edited-image.png'
	link.click()
})

const rotateLeft = () => {
	let rotation = parseInt(image.dataset.rotation || 0)
	rotation -= 90
	image.style.transform = `rotate(${rotation}deg)`
	image.dataset.rotation = rotation
}

const rotateRight = () => {
	let rotation = parseInt(image.dataset.rotation || 0)
	rotation += 90
	image.style.transform = `rotate(${rotation}deg)`
	image.dataset.rotation = rotation
}

const horizontalFlip = () => {
	const isHorizontal = image.style.transform === 'scaleX(-1)'
	if (image.style.transform === 'scaleX(-1)') {
		image.style.transform = 'scaleX(1)'
	} else {
		image.style.transform = 'scaleX(-1)'
	}
}

const verticalFlip = () => {
	let rotation = parseInt(image.dataset.rotation || 0)
	rotation += 180
	image.style.transform = `rotate(${rotation}deg)`
	image.dataset.rotation = rotation
}

rotateRightBtn.addEventListener('click', rotateRight)
rotateLeftBtn.addEventListener('click', rotateLeft)
verticalFlipBtn.addEventListener('click', verticalFlip)
horizontalFlipBtn.addEventListener('click', horizontalFlip)

updateImageFilter()

scrollBarUpdate()
setCurrentFilter()
