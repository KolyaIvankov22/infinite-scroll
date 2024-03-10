const imageContainer = document.querySelector('#image__container'),
   loader = document.querySelector('#loader')

// Variables to keep track of the number of uploaded and total images, and to store the array of received photos
let imagesLoaded = 0
let totalImages = 0
let photosArray = []

// A flag indicating whether new photos are in the process of being downloaded.
let loading = false

// Variables to store the number of photos to upload and the Unsplash API key.
let count = 3
const apiKey = 'jFgS8tteGD425f4oZfygQVaVnD6gt6GucN2yyz3xFek'
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`

// A function that is called when each image is loaded. It increments the downloaded images counter and checks if all images have already been downloaded.
function handleImageLoaded() {
   imagesLoaded++
   if (imagesLoaded === totalImages) {
      loader.hidden = true
      loading = false
   }
}

// A function to set element attributes.
function setAttributes(element, attributes) {
   for (const key in attributes) {
      element.setAttribute(key, attributes[key])
   }
}

// A function for creating image elements and displaying them in a container.
function displayPhotos() {
   imagesLoaded = 0
   totalImages = photosArray.length

   photosArray.forEach(item => {
      const element = document.createElement('a')
      setAttributes(element, {
         href: item.links.html,
         target: '_blank'
      })

      const img = document.createElement('img')
      setAttributes(img, {
         src: item.urls.regular,
         alt: item.alt_description,
         title: item.alt_description
      })

      img.addEventListener('load', handleImageLoaded)
      element.appendChild(img)
      imageContainer.appendChild(element)
   })
}

// A function to retrieve photos from the Unsplash API.
async function getPhotos() {
   if (loading) return
   loading = true
   try {
      const response = await fetch(apiUrl)
      photosArray = await response.json()
      displayPhotos()
      count += 3
   } catch (error) {
      console.error('Error fetching photos:', error)
   } finally {
      loading = false
   }
}

// Listens to the scroll event of the window and calls the getPhotos function if the page is scrolled down far enough and new photos can be loaded.
window.addEventListener('scroll', () => {
   if (
      window.innerHeight + window.scrollY >=
         document.body.offsetHeight - 1000 &&
      !loading
   ) {
      getPhotos()
   }
})

// First call to load initial photos on page load.
getPhotos()
