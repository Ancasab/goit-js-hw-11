"use strict"

import axios from "axios";
import Pixabay from "pixabay";
import Notiflix from "notiflix";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more'); 


let currentPage = 1;
let totalHits = 0;
let apiKey = '45639968-4ab0c3e34d3afa9a12b28af2f';

const createImageCard = (image) => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
        <a href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width = 320 height = 170/>
        </a>
        <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>     
    `;
    gallery.appendChild(card);
};

const fetchImages = async (query) => {
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`);  
        // console.log(response); 

        const { hits, total, totalHits: newTotalHits } = response.data;
        

        if (hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
            return;
        }
        if (currentPage === 1) {
            Notiflix.Notify.success(`Hooray! We found ${total} images`);
        }
        totalHits = newTotalHits;
        hits.forEach(image => createImageCard(image));

        new SimpleLightbox('.gallery a');

        if (currentPage * 40 >= totalHits) {
            loadMoreBtn.style.display = 'none';
            Notiflix.Notify.info('We are sorry, but you have reached the end of search results.');
        } else {
            currentPage++;
            loadMoreBtn.style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        Notiflix.Notify.failure('It is an error. Please try again');
    }
};

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchQuery = event.target.querySelector('input').value;
    currentPage = 1;
    gallery.innerHTML = '';
    loadMoreBtn.style.display = 'none';
    fetchImages(searchQuery);
});

loadMoreBtn.addEventListener('click', () => {
    fetchImages(searchForm.querySelector('input').value);
});