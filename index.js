const { menubar } = require('menubar')
const { fetch } = require('cross-fetch')

const mb = menubar()

function getCircleToken () {
  return '***********************a3cbd3'
}

class CircleClient {
  _token

  constructor (token) {
    this._token = token
  }

  async projects () {
    const me = await this.me()
    const projectUrls = Object.keys(me.projects)

    return projectUrls.map(url => {
      const parts = url.split('/')
      const projectName = parts[parts.length - 1]
      const orgName = parts[parts.length - 2]

      return { orgName, projectName }
    })
  }

  async me () {
    const meResponse = await fetch(
      `https://circleci.com/api/v1.1/me`,
      { headers: { 'Circle-Token': this._token } }
    )

    return await meResponse.json()
  }
}

mb.on('ready', async () => {
  console.log('app is ready')
  // your app code here
  mb.tray.setImage('circleci-logo-small.png')
})

mb.on('after-create-window', async () => {
  const client = new CircleClient(getCircleToken())
  const projectSelect = document.getElementById('project-select')
  const projects = await client.projects()

  projects.forEach(project => {
    const option = document.createElement('option')
    option.text = `${project.orgName}/${project.projectName}`;
    option.value = `${project.orgName}/${project.projectName}`;
    projectSelect.appendChild(option)
  })

  console.log(projects)
})
