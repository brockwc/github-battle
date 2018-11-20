const axios = require('axios');

const token = "370ac2d15227b642a32421acbbf7c1ef011b11d3"
const params = `?access_token=${token}`

const getProfile = (username) => {
  return axios.get(`https://api.github.com/users/${ username }${ params }`)
    .then(({ data }) => console.log(data) || data);
}

const getRepos = (username) => {
  return axios.get(`https://api.github.com/users/${ username }/repos${ params }`);
}

const getStarCount = (repos) => {
  return repos.data.reduce((count, { stargazers_count }) => count + stargazers_count, 0);
}

const calculateScore = ({ followers }, repos) => (followers * 3) + getStarCount(repos);

const handleError = (error) => {
  console.warn(`An error occured: ${error}`);
  return null;
}

const getUserData = (player) => {
  return Promise.all([
    getProfile(player),
    getRepos(player)
  ]).then(([profile, repos]) => console.log([profile, repos]) || ({
    profile,
    score: calculateScore(profile, repos)
  }));
}

const sortPlayers = (players) => {
  return players.sort((a, b) => b.score - a.score);
}

module.exports = {
  battle (players) {
    return Promise.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError);
  },
  fetchPopularRepos (language) {
    const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${ language }&sort=stars&order=desc&type=Repositories`)

    return axios.get(encodedURI)
      .then(({ data }) => data.items);
  }
}