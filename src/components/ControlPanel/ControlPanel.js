import React from 'react';
import InsertDoc from './InsertDoc';
import SyncButton from './SyncButton';

class ControlPanel extends React.Component {
  render() {
    return (
      <div>
        <h4>Insert into turtleDB</h4>
        <InsertDoc handleInsertClick={this.props.handleInsertClick} />
        <SyncButton 
          handleSyncClick={this.props.handleSyncClick}
          handleAutoSyncClick={this.props.handleAutoSyncClick}
          autoSync={this.props.autoSync}
        />
      </div>
    )
  }
}

export default ControlPanel;
