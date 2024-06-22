// =========== Ui Class =========== //
class Ui {

  // Method to display the games data in the index page
  displayGames(games) {
    let gamesContent = "";

    for (let i=0; i < games.length; i++) {

      gamesContent += `
        <div class="col-lg-4 col-md-6 col-xl-3">
          <div class="card h-100 bg-transparent" data-id="${games[i].id}">
            <div class="px-3 pt-3">
              <img src="${games[i].thumbnail}" class="card-img-top" alt="game thumbnail">
            </div>
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <h3 class="m-0 text-white">${games[i].title}</h3>
                  <span class="p-2 text-bg-primary">Free</span>
                </div>
                <p class="card-text text-center text-white opacity-50">
                ${games[i].short_description.split(" ").slice(0, 8).join(" ")}...
                </p>
              </div>
              <div class="card-footer d-flex justify-content-between">
                <span>${games[i].genre}</span>
                <span>${games[i].platform}</span>
              </div>
          </div>
        </div>
      `;

      document.getElementById("gamesData").innerHTML = gamesContent;

    }
  }

  // Method to display the a single game's data
  displayGameDetails(data) {
    let gameDetail = `
      <div class="col-md-4">
        <img src="${data.thumbnail}" alt="game thumbnail" class="w-100">
      </div>
      <div class="col-md-8">
        <h3>Title: ${data.title}</h3>
        <p>Category: <span class="text-bg-info">${data.genre}</span></p>
        <p>Platform: <span class="text-bg-info">${data.platform}</span></p>
        <p>Status: <span class="text-bg-info">${data.status}</span></p>
        <p class="small">${data.description}</p>
        <a href="${data.game_url}" target="_blank" class="btn btn-outline-warning mb-3">Show Game</a>
      </div>
    `;
    document.querySelector(".game-data").innerHTML = gameDetail;

  }
}

// =========== Details Class =========== //
class Details {

  constructor () {

    // Create an instance of the class Ui
    this.ui = new Ui();

    document.querySelector(".btn-close").addEventListener("click", () => {
      document.querySelector(".games").classList.remove("d-none");
      document.querySelector(".game-detail").classList.add("d-none");
    });

  }

  // Fetching single game's data from the API
  async getDetails(gemeId) {

    // Show the loader before fetching the data
    const loader = document.querySelector(".loading");
    loader.classList.remove("d-none");
    
    try {

      // Options: fetching method and API key
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'fdb321108emshd97abe78e0e4556p146924jsn4a40dbe9908a',
          'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
        }
      };

      // Fetching the data from the API using the id
      const res = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gemeId}`, options);
      const data = await res.json();

      // Display single game's details after fetching the data
      this.ui.displayGameDetails(data);

      // Hide the loader after displaying the data
      loader.classList.add("d-none")

    } catch (err) {
      alert(err);
    }


  }
}

// =========== Games Class =========== //
class Games {

  constructor () {

    // Default Ctegory when opening the site
    this.getGames("MMORPG");

    // Create an instance of the class Details
    this.details = new Details();

    // Create an instance of the class Ui
    this.ui = new Ui();

    this.links = document.querySelectorAll(".nav-link");
    for (const link of this.links) {
      link.addEventListener("click", (e) => {
        document.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");
        this.getGames(e.target.dataset.category);
      });
    }
  }

  // Fetching the games from the API
  async getGames (category) {

    // Show the loader before fetching the data
    const loader = document.querySelector(".loading");
    loader.classList.remove("d-none")

    try {
      // Options: fetching method and API key
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'fdb321108emshd97abe78e0e4556p146924jsn4a40dbe9908a',
          'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
        }
      };

      // Fetching the data from the API using the category
      const res = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`, options);
      const data = await res.json();

      // After fetching the data, Call the displayGames method from the Ui class to display the games in the page
      this.ui.displayGames(data);

      // Hide the loader after displaying the data
      loader.classList.add("d-none")

      // Call the getGameDetail() method after displaying the data so that clicking the single game will open the game's detail section
      this.getGameDetail();

    } catch(err) {

      alert(err);
      
    }


  }

  getGameDetail() {
    let cards = document.querySelectorAll(".card");
    for (const card of cards) {
      card.addEventListener("click", () => {
        document.querySelector(".games").classList.add("d-none");
        document.querySelector(".game-detail").classList.remove("d-none");
        this.details.getDetails(card.dataset.id);
      });
    }
  }
}

// Create an instance of the class Games to run immediately after opening the site
new Games();