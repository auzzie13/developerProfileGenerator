const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require('html-pdf');

function writeToPDF(html) {
  const options = { format: 'Letter' };
  pdf.create(html, options).toFile(`./resume.pdf`, (err) => {
    if (err) throw err;
  });
} 

function buildHTML(res) {
  const {
    name = res.data.name,
    userName = res.data.login,
    profileImg = res.data.avatar_url,
    location = res.data.location,
    github = res.data.html_url,
    blog = res.data.blog,
    followers = res.data.followers,
    repos = res.data.public_repos,
    bio = res.data.bio
  } = res.data;

  const html =  
  `
    <html>
      <body>
        <h1>${name} | <span>${userName}</span></h1>
        <h2>${location}</h2>
        <img width="50" height="50" src="${profileImg}" />
        <div>
          <a href="${github}">GitHub</a>
          <a href="${blog}">Blog</a>
        </div>
        <p>${bio}</p>
        <div>
          <span>Followers: ${followers}</span>
          <span>Repositories: ${repos}</span>
        </div>
      </body>
    </html>
  `;
  writeToPDF(html);
}

inquirer
  .prompt({
    message: "Enter your GitHub username",
    name: "username"
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl).then(buildHTML);
  });