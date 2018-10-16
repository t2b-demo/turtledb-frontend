import React from 'react';
import axios from 'axios';
import { Grid, Row, Col } from 'react-bootstrap';

// Components
import TableComponent from './TableComponent/TableComponent';
import ControlPanel from './ControlPanel/ControlPanel';

import TurtleDB from 'turtledb';

const dbName = "demo";
const turtleDB = new TurtleDB(dbName);
turtleDB.setRemote('http://localhost:3000');
window.turtleDB = turtleDB;

class Home extends React.Component {
    constructor() {
        super()
        this.state = {
          data: {
            docs: [],
            metaDocs: []
          },
          benchmark: {
            time: null,
            type: null,
            count: null,
          },
          selectedTreeMetaDoc: null,
          selectedTreeDoc: null,
          autoSync: false,
          storage: {
            appUsage: "0 B",
            appQuota: "0 B",
            totalQuota: "0 B"
          }
        }
    }
    
    componentDidMount() {
       this.syncStateWithTurtleDB();
    }

    setDefaultState = () => {
        this.setState({
          data: {
            docs: [],
            metaDocs: []
          },
          benchmark: {
            time: null,
            type: null,
            count: null,
          },
          selectedTreeMetaDoc: null,
          selectedTreeDoc: null,
          autoSync: false,
          storage: {
            appUsage: "0 B",
            appQuota: "0 B",
            totalQuota: "0 B"
          }
        });
    }

    syncStateWithTurtleDB = () => {
        turtleDB.readAllMetaDocsAndDocs()
          .then(data => this.setState({ data: data }))
          .then(() => this.updateTreeDocs())
          .then(() => this.updateStorageInfo());
    }

    updateTreeDocs = () => {
        if (this.state.selectedTreeMetaDoc) {
          const updatedMetaDoc = this.state.data.metaDocs.find(metaDoc => metaDoc._id === this.state.selectedTreeMetaDoc._id);
    
          if (updatedMetaDoc) {
            this.setState({ selectedTreeMetaDoc: updatedMetaDoc });
          } else {
            this.setState({ selectedTreeMetaDoc: null });
          }
        }
    
        this.setState({ selectedTreeDoc: null });
    }
    
    updateStorageInfo = () => {
        turtleDB.getStorageInfo()
          .then(info => this.setState({ storage: info }));
    }

    handleInsertClick = (obj) => {
      let startTime = Date.now();
        turtleDB.create(obj)
        .then(() => {
            let timeSpent = Date.now() - startTime;
            this.setState({
                benchmark: {
                time: timeSpent,
                type: "INSERT",
                count: 1
                }
          })
        })
        .then(() => this.syncStateWithTurtleDB())
    }

    handleDeleteClick = n => {
        let startTime = Date.now();
        turtleDB.idb.deleteBetweenNumbers(0, n)
          .then(() => {
            let timeSpent = Date.now() - startTime;
            this.setState({
              benchmark: {
                time: timeSpent,
                type: "DELETE",
                count: n
              }
            })
          })
          .then(() => this.syncStateWithTurtleDB())
    }

    handleUpdateClick = (n) => {
        let startTime = Date.now();
        turtleDB.editFirstNDocuments(n)
          .then(() => {
            let timeSpent = Date.now() - startTime;
            this.setState({
              benchmark: {
                time: timeSpent,
                type: "EDIT",
                count: n
              }
            });
          })
          .then(() => this.syncStateWithTurtleDB())
    }

    handleDropDatabase = () => {
        turtleDB.dropDB(dbName)
          .then(() => this.setDefaultState());
    }

    handleSyncClick = () => {
        turtleDB.sync()
          .then(() => this.syncStateWithTurtleDB())
          .catch((err) => console.log('Sync click -', err));
    }

    handleAutoSyncClick = () => {
        if (this.state.autoSync) {
          // if auto-sync on
          turtleDB.autoSyncOff();
          clearInterval(this.intervalId);
        } else {
          turtleDB.autoSyncOn();
          this.intervalId = setInterval(this.syncStateWithTurtleDB.bind(this), 3000);
        }
    
        this.setState((prevState) => ({ autoSync: !prevState.autoSync }));
    }

    handleCompactClick = () => {
        turtleDB.compactStore()
          .then(() => this.syncStateWithTurtleDB());
    }

    handleViewTreeClick = (metaDoc) => {
        this.setState({ selectedTreeMetaDoc: metaDoc });
        this.setState({ selectedTreeDoc: null });
    }

    handleSingleUpdateClick = (obj) => {
        turtleDB.update(obj._id, obj)
          .then(() => this.syncStateWithTurtleDB())
    }

    handleSingleDeleteClick = (_id) => {
        turtleDB.delete(_id)
          .then(() => this.syncStateWithTurtleDB())
    }

    handleTreeDocClick = (_id, rev) => {
        turtleDB.read(_id, rev)
          .then(doc => {
            this.setState({ selectedTreeDoc: doc })
          });
    }

    handlePickWinnerClick = () => {
        // access to doc in 'this.state.selectedTreeDoc'
        console.log('Doc to select as winner:', this.state.selectedTreeDoc);
        // {what: "ever", _id: "a8fcdeaa-d8ef-4503-9762-d8499bbc571c", _rev: "3-ba09f2c2cf66edc8a5efee5e52a502a6"}
        const doc = this.state.selectedTreeDoc;
        turtleDB.makeRevWinner(doc)
          .then(() => {
            this.syncStateWithTurtleDB();
          });
    }

    render() {
        return (
          <Grid>
            <Row className="show-grid">
              <Col md={2} xsOffset={1}>
                <ControlPanel style={{marginTop: 40}}
                    handleInsertClick={this.handleInsertClick}
                    handleUpdateClick={this.handleUpdateClick}
                    handleDeleteClick={this.handleDeleteClick}
                    handleDropDatabase={this.handleDropDatabase}
                    handleSyncClick={this.handleSyncClick}
                    handleAutoSyncClick={this.handleAutoSyncClick}
                    autoSync={this.state.autoSync}
                    handleCompactClick={this.handleCompactClick}
                  />
              </Col>
            </Row>
            <Row className="show-grid" style={{marginTop: 40}}>
              <Col md={9} mdPush={1}>
                <TableComponent
                    data={this.state.data}
                    handleSingleDeleteClick={this.handleSingleDeleteClick}
                    handleSingleUpdateClick={this.handleSingleUpdateClick}
                    handleViewTreeClick={this.handleViewTreeClick}
                  />
              </Col>
            </Row>
          </Grid>
        )
    }
}

export default Home;