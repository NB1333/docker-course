import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const values = await axios.get('/api/values/current');
      this.setState({ values: values.data });
    } catch (error) {
      console.error('Error fetching values:', error);
    }
  }

  async fetchIndexes() {
    try {
      const seenIndexes = await axios.get('/api/values/all');
      this.setState({
        seenIndexes: seenIndexes.data,
      });
    } catch (error) {
      console.error('Error fetching indexes:', error.message, error.response);
  
      // Add retry logic here if needed
      setTimeout(() => {
        this.fetchIndexes();
      }, 5000); // Retry after 5 seconds
    }
  }  

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/api/values', {
        index: this.state.index,
      });
      this.setState({ index: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        {this.state.loading && <p>Loading...</p>}
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
