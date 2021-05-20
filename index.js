const displayPicture = document.querySelector("#display-picture");
const fullName = document.querySelector("#name");
const userName = document.querySelector("#username");
const biography = document.querySelector("#bio");
const repoCount = document.querySelector("#repo-count")
const repoContainer = document.querySelector("#repo-cont")
console.log(process.env)
const user = (login, limit, affiliations) => `{ 
    user(login: "${login}") {  
        id
        avatarUrl
        bio
        name
        login
        repositories(last: ${limit}, affiliations: ${affiliations}) {
          edges {
            node {
              id
              description
              name
              updatedAt
              url
              languages(last: 20) {
                nodes {
                  color
                  name
                }
              }
              forkCount
              stargazerCount
              isPrivate
            }
          }
          totalCount
        }
      }
}`;

const renderProfile = ({ data }) => {
  const { avatarUrl, name, login, bio, repositories } = data.user;
  displayPicture.src = avatarUrl
  fullName.innerHTML = name
  userName.innerHTML = login
  biography.innerHTML = bio
  repoCount.innerHTML = repositories.totalCount + " results for public repositories"

  const repoFragment = document.createDocumentFragment();
  const repoList = document.createElement('ul');

  repositories.edges.forEach((repo) => {
    const repoListItem = document.createElement('li');
    const repoCont = document.createElement('article');
    const repoTop = document.createElement('div')
    const repoBottom = document.createElement('div')
    const repoLink = document.createElement('a')
    const repoName = document.createElement('h3')
    const star = document.createElement('button')
    const description = document.createElement('p')
    const languagesCont = document.createElement('span')
    const languageColor = document.createElement('span')
    const languageName = document.createElement('span')

    const stars = document.createElement('span')
    const forks = document.createElement('span')
    const updatedAt = document.createElement('span');
    repoCont.className = "repo"
    repoTop.className = "repo-top"
    repoBottom.className = "repo-bottom"
    repoName.className = "name"
    languageColor.className = "small-circle"
    star.className = "btn"
    repoLink.href = repo.node.url
    repoName.innerHTML = repo.node.name
    star.innerHTML = "Star"
    trimmedDescription = repo.node.description ? repo.node.description.substring(0, 89) : repo.node.description
    description.innerHTML = trimmedDescription;
    repo.node.languages.nodes.forEach((language) => {
      languageColor.style.backgroundColor = language.color
      languageName.innerHTML = " " + language.name
    })
    stars.innerHTML = repo.node.stargazerCount !== 0 ? repo.node.stargazerCount : null
    forks.innerHTML = repo.node.forkCount !== 0 ? repo.node.forkCount : null
    updatedAt.innerHTML = "Updated on " + new Date(repo.node.updatedAt).toDateString()
    repoListItem.appendChild(repoCont);
    repoList.appendChild(repoListItem);
    repoCont.appendChild(repoTop);
    repoCont.appendChild(repoBottom);
    repoCont.appendChild(description);
    repoTop.appendChild(repoLink);
    repoTop.appendChild(star);
    repoLink.appendChild(repoName); let isPrivate
    if (repo.node.isPrivate) {
      isPrivate = document.createElement('span')
      isPrivate.className = "label"
      isPrivate.innerHTML = repo.node.isPrivate ? "PRIVATE" : ""
      repoTop.appendChild(isPrivate);
    }
    repoBottom.appendChild(languagesCont)
    repoBottom.appendChild(stars)
    repoBottom.appendChild(forks)
    repoBottom.appendChild(updatedAt)
    languagesCont.appendChild(languageColor)
    languagesCont.appendChild(languageName)
  });

  repoFragment.appendChild(repoList);
  repoContainer.appendChild(repoFragment);
}

const options = {
  method: "post",
  headers: {
    "Authorization": "bearer 726cb4e47040f3e8893683ad03e48c57242b1270"
  },
  body: JSON.stringify({
    query: user("TGE24", 20, "OWNER")
  })
};

fetch(`https://api.github.com/graphql`, options)
  .then(res => res.json()).then(renderProfile)


  //Personal Access Token
  // b8d72dede90b144f2c89002c0e989839e7803fb4
