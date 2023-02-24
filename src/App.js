import React from 'react';
import './index.css'
import {SelectPicker} from 'rsuite';
import  ReactDOM  from 'react';
import {fetchMessages} from '/AutoEmailBackup/API.js';
class Inbox extends React.Component {
  state = {
    accountId: '',
    messages: [],
  };

  async componentDidMount() {
    const messages = await fetchMessages(this.state.accountId);
    this.setState({ messages });
  }

  handleAccountChange = async (value) => {
    const messages = await fetchMessages(value);
    this.setState({ accountId: value, messages });
  };

render() {
  return (
    <div className="inbox">
      <div className="inbox-header">
        <h1>Odczytywanie Wiadomości z bazy danch</h1>
        <SelectPicker
          data={accountOptions}
          value={this.state.accountId}
          onChange={this.handleAccountChange}
        />
      </div>
      <div className="inbox-messages">
        {this.state.messages.map((message) => (
          <div className="inbox-message" key={message._id}>
            <div className="inbox-message-header">
              <h2>{message.title}</h2>
              <p>Wiadomość od: {message.from}</p>
            </div>
            <div className="inbox-message-body">
              <p>{message.body}</p>
              {message.attachment && <p>Załącznik: {message.attachment}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
}

export default Inbox;


