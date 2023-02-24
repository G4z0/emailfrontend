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
    };
  }

  componentDidMount() {
    this.fetchAccounts();
  }
  
  async fetchAccounts() {
    console.log("fetching accounts");
    const url = `/accounts`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("accounts data:", data);
    this.setState({ accounts: data.data });
  }

  async fetchEmails(accountId) {
    if (!accountId) {
      return;
    }
  
    try {
      console.log("fetching emails for account ID:", accountId);
      const url = `/emails?account_id=${accountId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching email data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("email data:", data);
      this.setState({ emails: data.data });
    } catch (error) {
      console.error(error);
      this.setState({ emails: [] });
    }
  }

  handleAccountChange = (value) => {
    this.setState({ selectedAccountId: value });
    this.fetchEmails(value);
  }

  

  render() {
    const { accounts, selectedAccountId, emails } = this.state;

    if (emails === null) {
      return <div>Probably empty..</div>;
    }

    return (
      <div className="App">
        <h1>Select an account ID:</h1>
        <SelectPicker
          data={accounts}
          value={selectedAccountId}
          onChange={this.handleAccountChange}
          searchable={false}
          style={{ width: 300 }}
          placeholder="Select an account ID"
          renderMenuItem={(label, item) => {
            return (
              <div>
                {item.id}: {item.login}
              </div>
            );
          }}
        />
        <h2>Emails:</h2>
        <ul>
        {emails.map((email) => (
          <li key={email}>{email}
          From: {email.from}, Subject: {email.subject}, Date: {email.datetime}
          </li>
        ))}
      </ul>
      </div>
    );
  }
}

export default App;