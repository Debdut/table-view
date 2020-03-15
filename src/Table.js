import React from 'react'

import { snakeToCamel } from './util'

class Table extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      direction: null,
      position: -1,
      page: 0,
      data: this.props.data,
      numPages: Math.ceil(this.props.data.length / this.props.perPage)
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.data.length !== prevState.data.length) {
      return { data: nextProps.data, numPages: Math.ceil(nextProps.data.length / nextProps.perPage) }
    }
    return null
  }

  get head() {
    return (
      <thead>
        <tr>
          {this.props.headers
            .map((header, index) => (
              <th key={index} onClick={() => this.sort(index)}>
                <span className='pr-2'>{this.getSortIcon(index)}</span>
                {snakeToCamel(header)}
              </th>
            ))}
        </tr>
      </thead>
    )  
  }

  get body() {
    let data = [ ...this.state.data ]

    // Sort
    if (this.state.position > -1) {
      const key = this.props.headers[this.state.position]
      const compare = (e1, e2) => ((this.state.direction === 'down') ? 1 : -1) * (e1[key] > e2[key] ? 1 : -1)
      data.sort(compare)
    }

    // Paginate
    const start = this.state.page * this.props.perPage
    const end = (this.state.page + 1) * this.props.perPage
    data = data.slice(start, end)

    return (
      <tbody>
        {data
          .map(this.getRow)}
      </tbody>
    )
  }

  sort = (index) => {
    let direction = 'down'
    if (this.state.direction 
        && this.state.direction === 'down'
        && index === this.state.position) {
      direction = 'up'
    }
    this.setState({
      direction: direction,
      position: index
    })
  }

  getSortIcon = (index) => {
    const { position , direction } = this.state
    if (position === index) {
      if (direction === 'up') {
        return '▲'
      } else if (direction === 'down') {
        return '▼'
      }
    }
    return '♦'
  }

  getRow = (row, index) => {
    return (
      <tr key={index}
      onClick={() => this.props.onRowClick(row, index)}>
        {this.props.headers
          .map((header, index2) => <td key={index2}>{row[header]}</td>)}
      </tr>
    )
  }

  filter = (event) => {
    const filterKey = this.props.headers[this.props.filterBy]
    const needle = event.target.value
    const data = this.props.data
      .filter(row => row[filterKey].includes(needle))
    const numPages = Math.ceil(data.length / this.props.perPage)
    
    this.setState({ data, numPages })
  }

  updatePage = (page) => {
    this.setState({ page })
  }

  render () {

    return (
      <div>
        <input type='text' 
        placeholder={`Search by ${snakeToCamel(this.props.headers[this.props.filterBy])}`}
        value={this.state.filter}
        onChange={this.filter}
        className='form-control'/>
        <table className='table mt-5'>
          {this.head}
          {this.body}
        </table>
        <Paginate 
        numPages={this.state.numPages} 
        page={this.state.page} 
        update={this.updatePage} 
        max={10}/>
      </div>
    )
  }
}

class Paginate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shift: 0
    }
  }

  shift = (step) => {
    const { numPages, max } = this.props
    const { shift } = this.state

    const nextShift = shift + step

    if ((nextShift >= 0) && ((nextShift * max) < numPages)) {
      this.setState({ shift: nextShift })
    }
  }

  pageShift = (step) => {
    const { numPages, page } = this.props
    const nextPage = page + step

    if (nextPage >= 0 && nextPage < numPages) {
      this.props.update(nextPage)
    }
  } 

  render () {
    const { numPages, max } = this.props
    const { shift } = this.state

    const pages = Array(numPages)
      .fill(0)
      .map((_, index) => index + 1)
      .slice(shift * max, (shift + 1) * max)
    
    return (
      <div className='Paginate'>

        <div className='row'>
          <button className='btn btn-primary'
          disabled={this.props.page === 0}
          onClick={() => this.pageShift(-1)}>Previous</button>
          <button className='btn btn-primary ml-auto'
          disabled={this.props.page === numPages - 1}
          onClick={() => this.pageShift(1)}>Next</button>
        </div>

        <div className='row mt-3'>
          <div className={`col-1 text-center border py-1 ${(shift > 0) ? 'text-primary' : 'text-muted'}`}
          onClick={() => this.shift(-1)}>◀</div>

          {pages.map((page, index) => (
            <div key={index} className={`col-1 text-center py-1 ${(this.props.page + 1 === page) ? 'bg-primary text-white' : 'text-primary border'}`}
            onClick={() => this.props.update(page - 1)}>
              {page}
            </div>
          ))}

          <div className={`col-1 text-center border py-1 ml-auto ${(((shift + 1) * max) < numPages) ? 'text-primary' : 'text-muted'}`}
          onClick={() => this.shift(1)}>▶</div>
        </div>

      </div>
    )
  }
}

export default Table