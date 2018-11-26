const token = "370ac2d15227b642a32421acbbf7c1ef011b11d3"
const params = `?access_token=${token}`

const getProfile = async (username) => {
  const response = await fetch(`https://api.github.com/users/${ username }${ params }`);
  
  return response.json();
}

const getRepos = async (username) => {
  const response = await fetch(`https://api.github.com/users/${ username }/repos${ params }`);

  return response.json();
}

const getStarCount = (repos) => {
  return repos.reduce((count, { stargazers_count }) => count + stargazers_count, 0);
}

const calculateScore = ({ followers }, repos) => (followers * 3) + getStarCount(repos);

const handleError = (error) => {
  console.warn(`An error occured: ${error}`);
  return null;
}

const getUserData = async (player) => {
  const [ profile, repos ] = await Promise.all([
    getProfile(player),
    getRepos(player)
  ])
  
  return {
    profile,
    score: calculateScore(profile, repos)
  };
}

const sortPlayers = (players) => {
  return players.sort((a, b) => b.score - a.score);
}

export async function battle (players) {
  const results = await Promise.all(players.map(getUserData))
    .catch(handleError);
  
  return results === null
    ? results
    : sortPlayers(results);
    
}

export async function fetchPopularRepos (language) {
  const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${ language }&sort=stars&order=desc&type=Repositories`);
  
  const response = await fetch(encodedURI)
    .catch(handleError);
  const repos = await response.json();

  return repos.items;
}