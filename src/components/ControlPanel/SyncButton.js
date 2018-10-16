import React from 'react';
import { Grid, Row, Col, Button, FormGroup, Checkbox } from 'react-bootstrap';

class SyncButton extends React.Component {
  render() {
    return (
      <Grid style={{marginTop: 40}}>
        <Row className="show-grid">          
          <Col md={2} mdPush={6}>
            <FormGroup>
              <Checkbox inline
              id="auto-sync-checkbox"
              checked={this.props.autoSync}
              onChange={this.props.handleAutoSyncClick}
              >AutoSync</Checkbox>
            </FormGroup>
          </Col>
          <Col md={1} mdPull={0}>
            <Button
                bsStyle="primary"
                onClick={this.props.handleSyncClick}
                disabled={this.props.autoSync}
              >Sync
            </Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default SyncButton;
