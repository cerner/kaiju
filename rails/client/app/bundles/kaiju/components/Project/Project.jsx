import React from 'react';
import { Provider } from 'react-redux';
import { camelizeKeys } from 'humps';
import 'antd/lib/style/v2-compatible-reset.css';
import { setReferenceComponents, updateComponent } from './actions/actions';
import configureStore from './store/projectStore';
import BrowserContainer from './containers/BrowserContainer';
import EditorContainer from './containers/EditorContainer';
import Header from './containers/HeaderContainer';
import Sidebar from './components/Sidebar/Sidebar';
import initializeDrag from './utilities/drag';
import axios from '../../utilities/axios';
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

    axios
      .get(`/projects/${this.store.getState().project.id}/reference_components`)
      .then(({ data }) => {
        this.store.dispatch(setReferenceComponents(data));
      });
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.dispatchMessage);
  }

  dispatchMessage({ data }) {
    const {
      components, message, root, selectedComponent,
    } = data;
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
