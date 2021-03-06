import React from 'react';
import Panel from './common/Panel';
import Container from './common/Container';
import github from './assets/github.svg';
import moment from 'moment';
const COMPONENT_NAME = "github"
class Github extends Container {
  constructor(props) {
    super(props, COMPONENT_NAME);
  }

  render() {
    return (
        <Panel
          title={COMPONENT_NAME}
          refreshData={this.refreshData}
        >
          {this.state.data &&
            this.state.data.map((entry, i) => {
              const commitDate = moment(entry.author.date).format("MMM DD@HH:mm");
              return (
                <div key={entry + i} className="github-entry">
                  <div className="github-entry-details">
                    <img className="github-icon" src={github} alt="Github icon" />
                    <span className="github-name" >{entry.author.name}</span>
                    <span> committed to </span>
                    <a 
                      href={`https://github.com/Seneca-CDOT/${entry.repoName}/tree/${entry.branchName}`}  
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                    <span className="span-emphasis github-link"> {`${entry.repoName}/${entry.branchName}:`}</span>
                    </a>
                  </div>
                  <p className="github-message">{`"${entry.message}"`} <span className="github-time">{` (${commitDate})`}</span></p>
                 
                </div>
              );
            })
          }
        </Panel>
    );
  }
}

export default Github;
