import React from 'react'
import { useParams } from 'react-router-dom'

import { snakeToCamel } from './util'

function User ({ userList, properties, back }) {
  const id = parseInt(useParams().id, 10)
  
  let user
  for (let index = 0; index < userList.length; index++) {
    const tmpUser = userList[index]
    if (tmpUser.id === id) {
      user = tmpUser
      break
    }
  }

  return (
    <div className='User'>
      <span style={{ fontWeight: 'bold', fontSize: '30px' }}
      onClick={back}>←</span>
      <h2 className='mt-5'>{user.first_name} {user.last_name}</h2>
      <ul className='list-group mt-5'>
        {properties.map((property, index) => (
          <li className='list-group-item' key={index}>
            <span className='font-weight-bold'>{snakeToCamel(property)}</span>
            <span className='float-right'>{user[property]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default User