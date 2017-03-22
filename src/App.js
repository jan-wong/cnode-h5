import React, { Component } from 'react';

import axios from 'axios';

const getURLParam = (param) => {
  let query = window.location.search.slice(1)
  let queryArr = query.split('&')
  let queryObj = {};

  for (let i=0; i<queryArr.length; i++) {
    let a1 = queryArr[i].split('=')[0]
    let a2 = queryArr[i].split('=')[1]
    queryObj[a1] = a2
  }

  return (param && queryObj[param]) ? queryObj[param] : null
}

const Title = (props) => {
  const { data } = props;

  return (
    <div className="header">
      <div className="title">{data.title}</div>
      <div className="des">
        <span className="author">{data.loginname}</span>
        <span className="visit">{data.visit}</span>
      </div>
    </div>
  )
}

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      head: {},
      content: '',
      reply: []
    }
  }

  componentDidMount () {
    let user_id = getURLParam('id')
    axios.get(`https://cnodejs.org/api/v1/topic/${user_id}`).then((res) => {
      let data = res.data;
      if (data.success === true) {
        let result = data.data;
        console.log(result)
        let head = {
          title: result.title,
          loginname: result.author.loginname,
          visit: result.visit_count
        }
        this.setState({
          head,
          content: result.content,
          reply: result.replies
        })
      }
    })
  }

  render () {
    let ReplyList = this.state.reply.map((obj, index) => {
      return (
        <li className="reply-list" key={index}>
          <div className="reply-title">
            <img src={obj.author.avatar_url} className="reply-img" alt="img" />
            <span className="reply-name">{obj.author.loginname}</span>
            <span className="reply-floor">{index}</span>
            <a className="reply-praise">
              <i className="icon icon-praise"></i><span className="praise-count">{obj.ups.length}</span> 
            </a>
          </div>
          <div dangerouslySetInnerHTML={{__html: obj.content}}>
          </div>
        </li>
      )
    })

    return (
      <div className="container">
        <Title data={this.state.head} />
        <div className="mark" dangerouslySetInnerHTML={{__html: this.state.content}}>
        </div>
        <div className="reply">
          <ul>
            {ReplyList}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;