import React, { Component } from  'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './EditBookmark.css';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    title: '', 
    url: '', 
    rating: 1, 
    description: ''
  };

  componentDidMount(){
    const f = `${config.API_ENDPOINT}/${this.props.match.params.id}`;

    fetch(f, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => Promise.reject(error))
      }
      return res.json()
    })
    .then(data => {
      this.setState({
      title: data.title,
      url: data.url,
      rating: data.rating,
      description: data.description
    })})
    .catch(error => {
      console.error(error)
      this.setState({ error })
    })

  }

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, url, description, rating } = e.target
    const bookmark = {
      title: title.value,
      url: url.value,
      description: description.value,
      rating: Number(rating.value),
    }
    this.setState({ error: null })

    const f = `${config.API_ENDPOINT}/${this.props.match.params.id}`;

    fetch(f, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(() => {
        title.value = ''
        url.value = ''
        description.value = ''
        rating.value = ''
        const updatedBm = {
          ...bookmark,
          id: Number(this.props.match.params.id)
        }
        this.context.updateBookmark(updatedBm)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  render() {
    const { error } = this.state
    return (
      <section className='AddBookmark'>
        <h2>Edit a bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              value={this.state.title}
              onChange={e => this.setState({title: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              value={this.state.url}
              onChange={e => this.setState({url: e.target.value})}
              placeholder='https://www.great-website.com/'
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              onChange={e => this.setState({description: e.target.value})}
              value={this.state.description}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              onChange={e => this.setState({rating: e.target.value})}
              value={this.state.rating}
              min='1'
              max='5'
              required
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
