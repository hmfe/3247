import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import config from "./config";
import "./stylesheets/main.sass";

class App extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      fetchedBooks: [],
      searchHistory: [],
      searchItem: {
        query: "",
        timestamp: "",
        id: "",
      },
    };
  }

  // get users from config endpoint based on query from input
  fetchUsers(query) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      axios.get(`${config.baseUrl}?search=${query}`, {
        params: {
          start: 0,
          max: 10,
        },
      }).then(({ data }) => {
        this.setState({
          fetchedBooks: data.title ? data.title : [],
        });
      });
    }, 300); // timeout set to delay the searching so it's not triggered after every key press
  }

  // display an individual book element
  book(book) {
    const { searchHistory } = this.state;
    const { titleweb, isbn, authorweb } = book;
    return (
      <li
        key={isbn}
        className="book"
        onClick={() => { // add to the search history list after clicking on item
          const searchItem = {
            query: `${authorweb} - ${titleweb}`,
            timestamp: moment().format("YYYY-MM-DD, h:mm:ss A"),
            id: `${titleweb}${moment().format("YYYY-MM-DD, h:mm:ss A")}`,
          };
          searchHistory.push(searchItem);
          this.setState({ searchItem });
        }}
      >
        {authorweb} - {titleweb}
      </li>
    );
  }

  // display an item in the list of search queries
  searchHistoryItem(searchItem) {
    return (
      <li
        key={`${searchItem.query}${searchItem.timestamp}`}
        className="searchHistoryItem"
      >
        <span>
          <strong>{searchItem.query}&nbsp;</strong>
          {searchItem.timestamp}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            this.deleteSearchItem(searchItem);
          }}
          className="deleteSearchHistoryItem"
        >
          &times;
        </button>
      </li>
    );
  }

  // function to delete the item from the search history list
  deleteSearchItem(searchItem) {
    const { searchHistory } = this.state;
    const newSearchHistory = searchHistory.filter(
      (objects) => objects.id !== searchItem.id,
    );
    this.setState({
      searchHistory: newSearchHistory,
    });
  }

  // add query from input to the search history list after pressing enter button
  addToSearchHistory(e) {
    this.setState({
      searchItem: {
        query: e.currentTarget.value,
        timestamp: moment().format("YYYY-MM-DD, h:mm:ss A"),
        id: `${e.currentTarget.value}${moment().format("YYYY-MM-DD, h:mm:ss A")}`,
      },
    });
    const { searchHistory, searchItem } = this.state;
    if (e.keyCode === 13) {
      searchHistory.push(searchItem);
    }
  }

  // clear the search history list
  clearHistory() {
    this.setState({
      searchHistory: [],
    });
  }

  render() {
    const { fetchedBooks, searchHistory } = this.state;
    return (
      <div className="wrapper">
        <h1 className="appTitle">BookSearch</h1>
        <input
          onChange={(e) => this.fetchUsers(e.target.value)}
          placeholder="Type to search books"
          onKeyUp={(e) => this.addToSearchHistory(e)}
          className="searchBooks"
        />
        {fetchedBooks.length ? (
          <ul className="bookList">
            {fetchedBooks.map((book) => this.book(book))}
          </ul>
        ) : null}
        <div className="searchHeader">
          <h3 className="subTitle">Search history:</h3>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              this.clearHistory(e);
            }}
            className="clearSearchHistory"
          >
            Clear search history
          </button>
        </div>
        {searchHistory.length ? (
          <ul className="searchHistoryList">
            {searchHistory.map((item) => this.searchHistoryItem(item))}
          </ul>
        ) : null}
      </div>
    );
  }
}

export default App;
