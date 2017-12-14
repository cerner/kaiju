import React from 'react';
import ajax from 'superagent';
import { Provider } from 'react-redux';
import { camelizeKeys } from 'humps';
import { setReferenceComponents, updateComponent } from './actions/actions';
import configureStore from './store/projectStore';
import BrowserContainer from './containers/BrowserContainer';
import EditorContainer from './containers/EditorContainer';
import Header from './containers/HeaderContainer';
import Sidebar from './components/Sidebar/Sidebar';
import initializeDrag from './utilities/drag';
import './Project.scss';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.store = configureStore(camelizeKeys(this.props));
    this.dispatchMessage = this.dispatchMessage.bind(this);
  }

  componentDidMount() {
    initializeDrag();
    window.addEventListener('message', this.dispatchMessage);

    ajax
     .get(`/projects/${this.store.getState().project.id}/reference_components`)
     .set('Accept', 'application/json')
     .end((error, { text }) => {
       this.store.dispatch(setReferenceComponents(JSON.parse(text)));
     });
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.dispatchMessage);
  }

  dispatchMessage({ data }) {
    const { components, message, root, selectedComponent } = data;
    if (message === 'kaiju-component-updated') {
      this.store.dispatch(updateComponent({ components, root, selectedComponent }));
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <div className="kaiju-Project">
          <Header />
          <div className="kaiju-Project-layout">
            <Sidebar />
            <BrowserContainer />
            <EditorContainer />
          </div>
        </div>
      </Provider>
    );
  }
}

export default Project;
