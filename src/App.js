import React from 'react'
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom'

import Table from './Table'
import User from './User'

// import userList from './users.json'
const properties = ['first_name', 'last_name', 'company_name', 'city', 'state', 'zip', 'email', 'web', 'age']

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userList: []
    }
  }

  async componentDidMount () {
    const url = 'http://datapeace-storage.s3-us-west-2.amazonaws.com/dummy_data/users.json'
    const response = await fetch(url)
    const userList = await response.json()

    this.setState({ userList })
  }

  render () {
    const { userList } = this.state
    return (
      <div className="App container-fluid mt-5 px-5">
        <Router>
          <RoutingSwitch data={{ userList, properties }}/>
        </Router>
      </div>
    )
  }
}

function RoutingSwitch ({ data : { userList, properties }}) {
  let history = useHistory()

  function onRowClick (row, index) {
    history.push(`/user/${row.id}`)
  }

  function back () {
    history.push('/')
  }

  return (
    <Switch>
      <Route exact path='/'>
        <Table data={userList} headers={properties} onRowClick={onRowClick} perPage={5} filterBy={0}/>
      </Route>
      <Route path="/user/:id" children={<User userList={userList} properties={properties} back={back}/>} />
    </Switch>
  )
}

export default App
