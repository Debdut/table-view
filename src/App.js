import React from 'react'
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom'

import Table from './Table'
import User from './User'

import userList from './users.json'
const properties = ['first_name', 'last_name', 'company_name', 'city', 'state', 'zip', 'email', 'web', 'age']

function App () {
  return (
    <div className="App container-fluid mt-5 px-5">
      <Router>
        <RoutingSwitch/>
      </Router>
    </div>
  )
}

function RoutingSwitch () {
  let history = useHistory()

  function onRowClick (row, index) {
    history.push(`/${row.id}`)
  }

  function back () {
    history.push('/')
  }

  return (
    <Switch>
      <Route exact path='/'>
        <Table data={userList} headers={properties} onRowClick={onRowClick} perPage={5} filterBy={0}/>
      </Route>
      <Route path="/:id" children={<User userList={userList} properties={properties} back={back}/>} />
    </Switch>
  )
}

export default App
