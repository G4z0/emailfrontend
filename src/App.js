import React, { Component } from 'react';
import './App.css';
import { SelectPicker } from 'rsuite';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      selectedAccountId: null,
      emails: [],
      currentPage: 1,
      emailsPerPage: 50,
    };
    this.handleClick = this.handleClick.bind(this);
  }
      

  componentDidMount() {
    this.fetchAccounts();
  }

  async fetchAccounts() {
    const url = `http://192.168.2.72:9000/accounts`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.success) {
      this.setState({ accounts: data.data })
    } else {
      this.setState({ accounts: [] })
    }
  }


  async fetchEmails(accountId) {
    if (!accountId) {
      return [];
    }
    try {
      console.log("fetching emails for account ID:", accountId);
      const url = `http://192.168.2.72:9000/emails?account_id=${accountId}`;
      console.log("url:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching email data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("email data:", data);
      if (data.success) {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  

  handleAccountChange = async (value) => {
    this.setState({ selectedAccountId: value });
      try {
      const emails = await this.fetchEmails(value);
      this.setState({ emails, currentPage: 1 });
    } catch (error) {
      console.error(error);
      this.setState({ emails: [] });
      
    }
    
  };
  

  handleClick = (event) => {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  render() {

    const { accounts, selectedAccountId, emails, currentPage, emailsPerPage } = this.state;
  
    if (emails === null) {
      return <div>Probably empty..</div>;
    }
  
    const totalEmails = emails.length;
    const lastEmailIndex = currentPage * emailsPerPage;
    const firstEmailIndex = lastEmailIndex - emailsPerPage;
    const displayedEmails = emails.slice(firstEmailIndex, lastEmailIndex);
  
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalEmails / emailsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    const renderPageNumbers = (
      <div className="Pages">
        {pageNumbers.map((number) => (
          <li
            key={number}
            id={number}
            onClick={() => this.handlePageChange(number)}
            className={currentPage === number ? "active" : null}
          >
            {number}
          </li>
        ))}
      </div>
    );
    return (
      
      <div className="App">
        <SelectPicker
          data={accounts}
          value={selectedAccountId}
          onChange={this.handleAccountChange}
          searchable={true}
          style={{
          width: 200,
          fontSize: '14px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          boxShadow: '0 0 3px #ccc',
          marginBottom: '10px',
          padding: '10px',
        }}
          placeholder="Select an account ID"
          labelKey="login"
          valueKey="id"
          renderMenuItem={(label, item) => {
            return (
              <div className="SelectMenuItem">
                {item.id}: {item.login}
              </div>
            );
          }}
          menuClassName="SelectMenu"
          menuStyle={{ position: "absolute", left: 0, right: 0 }}
        />
        <div className="header">
        <h2>Emails:</h2>
        </div>
        <ul>
          {displayedEmails.map((email) => (
            <li key={email.id}>
              ID: {email.id}, <br />
              From: {email.from},<br />
              Subject: {email.subject},<br />
              Date: {email.datetime}
              <br />
            </li>
          ))}
        </ul>
        {renderPageNumbers}
      </div>
      
    );
  }
}

export default App;
