import axios from 'axios';

const token = "787b12207b67d52ebedcfa817bca4413b231de6b"
const params = `?access_token=${token}`

const getProfile = (username) => {
  axios.get(`https://api.github.com/users/${ username }${ params }`)
    .then(user => user.data);
}

const getRepos = (username) => {
  axios.get(`https://api.github.com/users/${ username }/repos${ params }`);
}

const getStarCount = (repos) => {
  repos.data.reduce((count, repo) => { count + repo.stargazers_count }, 0);
}

const calculateScore = (profile, repos) => {
  const followers = profile.followers;
  const totalStars = getStarCount(repos);

  return (followers * 3) + totalStars;
}

const handleError = (error) => {
  console.warn(`An error occured: ${error}`);
  return null;
}

const getUserData = (player) => {
  axios.all([
    getProfile(player),
    getRepos(player)
  ]).then((data) => {
    let profile = data[0];
    let repos = data[1];

    return {
      profile,
      score: calculateScore(profile, repos)
    }
  })
}

const sortPlayers = (players) => {
  players.sort((a, b) => b.score - a.score);
}

export default {
  battle: function (players) {
    return axios.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError);
  },
  fetchPopularRepos: function (language) {
    const encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:' + language + '&sort=stars&order=desc&type=Repositories')

    return axios.get(encodedURI)
      .then(function (response) {
        return response.data.items;
      })
  }
}