import React, { Component } from 'react';
import './App.css';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid text-monospace main">
          <br></br>
          &nbsp;
          <br></br>
          <div className="row">
            <div className="col-md-10">
              <div className="embed-responsive embed-responsive-16by9" style={{ maxHeight: '720px'}}>
                <video
                  src={`https://ipfs.infura.io/ipfs/${this.props.currentHash}`}
                  controls
                >
                </video>
              </div>
            <h3 className="mt-3"><b><i className="idea-title">{this.props.currentTitle}</i></b></h3>
          </div>
          <div className="vide-feed col-md-2 border border-secondary overflow-auto text-center" style={{ maxHeight: '4000px', minWidth: '175px' }}>
            <h5 className="feed-title"><b>Idea Feed 📺</b></h5>
            <form onSubmit={(event) => {
              event.preventDefault()
              const title = this.ideaTitle.value
              this.props.uploadIdea(title)
            }} >
              &nbsp;
              <input type='file' accept=".mp4, .mov, .mkv .ogg .wmv" onChange={this.props.captureFile} style={{ width: '250px' }} />
                <div className="form-group mr-sm-2">
                  <input
                    id="ideaTitle"
                    type="text"
                    ref={(input) => { this.ideaTitle = input }}
                    className="form-control-sm mt-3 mr-3"
                    placeholder="Title.."
                    required />
                </div>
              <button type="submit" className="btn border border-dark btn-primary btn-block btn-sm">Upload</button>
              &nbsp;
            </form>
            { this.props.ideas.map((idea, key) => {
              return(
                  <div className="card mb-4 text-center hover-overlay bg-secondary mx-auto" style={{ width: '195px'}} key={key} >
                    <div className="card-title bg-dark">
                      <small className="text-white"><b>{idea.title}</b></small>
                    </div>
                    <div>
                      <p onClick={() => this.props.changeIdea(idea.hash, idea.title)}>
                        <video
                          src={`https://ipfs.infura.io/ipfs/${idea.hash}`}
                          style={{ width: '170px' }}
                        />
                      </p>
                    </div>
                  </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
