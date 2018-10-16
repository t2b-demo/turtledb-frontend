import React from 'react';

class InsertDoc extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      age: "",
      email: "",
      phone: "",
      company: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInsertClick = this.handleInsertClick.bind(this);
  }

  handleInsertClick = event => {
    event.preventDefault();
    const insertObj = {
      name: this.state.name,
      age: parseInt(this.state.age, 10), 
      company: this.state.company,
      email: this.state.email,
      phone: this.state.phone
    };
    this.props.handleInsertClick(insertObj);
  }

  handleChange = event => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className='row'>
        <div className="col">
          <form className="form-inline" onSubmit={this.handleInsertClick}>
            <div className="form-row"> 
                <div className="form-group col">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control"  
                  name="name" 
                  value={this.props.name} onChange={this.handleChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                <label htmlFor="age">Age</label>
                <input type="number" className="form-control"  
                  name="age" 
                  value={this.props.age} onChange={this.handleChange}/>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" 
                  name="email" 
                  value={this.props.email} onChange={this.handleChange}/>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                <label htmlFor="phone">Phone</label>
                <input type="phone" className="form-control" 
                  name="phone"  
                  value={this.props.phone} onChange={this.handleChange}/>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                <label htmlFor="company">Company</label>
                <input type="text" className="form-control" 
                  name="company" 
                  value={this.props.company} onChange={this.handleChange}/>
                </div>
            </div>

            <input className="btn btn-primary" type="submit" value="Save" />
            <button className="btn btn-danger" value="cancel" onClick={this.props.closeModal}>Cancel</button>
          </form>
        </div>
      </div>
    )
  }
}

export default InsertDoc;
