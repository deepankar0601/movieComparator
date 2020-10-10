/* const fetchData = async (search) =>{
    const response= await axios.get('https://www.omdbapi.com/',{
        params:{
            apikey:'2f4c1378',
            s: search
        }
    });
    return response.data.Search;
}
const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label><b>Search for movie</b></label>
<input class='input' />
<div class='dropdown'>
<div class='dropdown-menu'>
<div class='dropdown-content results'>
</div>
</div>
</div>
`;
const dropdown = document.querySelector('.dropdown');
const input = document.querySelector('input');
const wrapper = document.querySelector('.results');

const inputOn= async (e) => {

  const movies = await fetchData(e.target.value);
  if(!movies.length){
      dropdown.classList.remove('is-active');
      return;
  }
  console.log(movies);
  dropdown.classList.add('is-active');
  for(let movie of movies){
      const option = document.createElement('a');
      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; 
      option.classList.add('dropdown-item');
      option.innerHTML=`
      <img src="${imgSrc}" />
      ${movie.Title} `;
    wrapper.appendChild(option);
  }
  
}
    
input.addEventListener('input', debounce(inputOn)); 
root.addEventListener('click',(e)=>{
  if(!root.contains(e.target)){
      dropdown.classList.remove('is-active');
  }
})*/
const autocompleteConfig = {
  movieRender(movie){
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}" />
    ${movie.Title} (${movie.Year})
  `
  }, 
  inputValue(movie){
    return movie.Title;
  },
  fetchData: 
        async searchTerm => {
          const response = await axios.get('https://www.omdbapi.com/', {
            params: {
             apikey: '2f4c1378',
              s: searchTerm
          }
       });
  
          if (response.data.Error) {
                 return [];
            }
  
        return response.data.Search;
     }
}
  movieAutocomplete({
    ...autocompleteConfig,
    root : document.querySelector('#left-autocomplete'),
    onMovieOption(movie){
      document.querySelector('.tutorial').classList.add('is-hidden');
      return movieSelect(movie,document.querySelector('#left-autocomplete'),'left');
    }
    
  });
  movieAutocomplete({
    ...autocompleteConfig,
    root : document.querySelector('#right-autocomplete'),
    onMovieOption(movie){
      document.querySelector('.tutorial').classList.add('is-hidden');
      return movieSelect(movie,document.querySelector('#right-autocomplete'),'right');
    }
    
  });
  let leftMovie;
  let rightMovie;
  const movieSelect = async (movie,movieSummaryElement,side) =>{
    const response= await axios.get('https://www.omdbapi.com/',{
        params:{
            apikey:'2f4c1378',
            i: movie.imdbID
        }
    });
    console.log(response.data);
   movieSummaryElement.innerHTML = movieTemplate(response.data);
   if(side === 'left'){
     leftMovie = response.data;
   }else{
     rightMovie = response.data;
   }

   if(leftMovie && rightMovie){
     movieComparison();
   }
}
const movieComparison = () =>{
  let leftSideStat = document.querySelectorAll('#left-autocomplete .notification');
  let rightSideStat = document.querySelectorAll('#right-autocomplete .notification');
  leftSideStat.forEach((leftStat , index) =>{
    let rightStat = rightSideStat[index];
    let leftSideValue = parseFloat(leftStat.dataset.value);
    let rightSideValue =parseFloat(rightStat.dataset.value);
    
    if(leftSideValue > rightSideValue){
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-danger');
    }
    else{
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-danger');
    }
  });
} 

const movieTemplate = (movieDetail) => {
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
  const rottenTomatoes = parseInt(movieDetail.Ratings[1].Value.replace(/%/g,''));
  console.log(metascore,imdbRating,imdbVotes,rottenTomatoes);
 let count = 0;
  const awards = movieDetail.Awards.split(' ').reduce((prev,word) =>{
      let value= parseInt(word);
      if(isNaN(value)){
        return prev;
      }
      else{
        return (prev + value);
      }
  },0);
  console.log(awards)
    
 
   


    return `
    <article class='media'>
    <figure class='media-left'>
    <p class='image'>
    <img src='${movieDetail.Poster}' />
    </p>
    </figure>
    
    <div class='media-content'>
    <div class='content'>
    <h1>${movieDetail.Title}</h1>
    <h4>${movieDetail.Genre}</h4>
    <p>${movieDetail.Plot}</p>
    </div>
    </div>
    </article>
    <article data-value = ${awards} class='notification is-primary'>
    <p class='title'>${movieDetail.Awards}</p>
    <p class='subtitle'>Awards</p>
    </article>
    <article data-value = ${rottenTomatoes} class='notification is-primary'>
    <p class='title'>${movieDetail.Ratings[1].Value}</p>
    <p class='subtitle'>Rotten Tomatoes</p>
    </article>
    <article data-value = ${metascore} class='notification is-primary'>
    <p class='title'>${movieDetail.Metascore}</p>
    <p class='subtitle'>Metascore</p>
    </article>
    <article data-value = ${imdbRating} class='notification is-primary'>
    <p class='title'>${movieDetail.imdbRating}</p>
    <p class='subtitle'>IMDB Rating</p>
    </article>
    <article data-value = ${imdbVotes} class='notification is-primary'>
    <p class='title'>${movieDetail.imdbVotes}</p>
    <p class='subtitle'>IMDB Votes</p>
    </article>
     `
}



  
  

   