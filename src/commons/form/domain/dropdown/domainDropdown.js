import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import _ from 'lodash';

import {
  loadDomains
} from '@ist-supsi/bmsjs';

import {
  Form,
  Header,
} from 'semantic-ui-react';

class DomainDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
      language: this.props.i18n.language
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    const {
      domains,
      schema
    } = this.props;
    if(!domains.data.hasOwnProperty(schema) && domains.isFetching === false){
      this.props.loadDomains();
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if (this.props.selected !== nextProps.selected) {
      return true;
    }else if (this.state.language !== nextProps.i18n.language) {
      return true;
    }
    return false;
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const state = {...prevState};
    if (_.isNil(nextProps.selected)){
      if(nextProps.multiple === true) {
        state.selected = [];
      } else {
        state.selected = null;
      }
    } else {
      state.selected = nextProps.selected;
    }
    if (nextProps.i18n.language !== prevState.language){
      state.language = nextProps.i18n.language;
    }
    if (_.isEqual(state, prevState)) return null;
    return state;
  }

  handleChange(event, data) {
    const {
      onSelected,
      domains,
      schema,
      multiple
    } = this.props;
    if(multiple===true){
      const selection = [];
      for (let i = 0; i < domains.data[schema].length; i++) {
        let h = domains.data[schema][i];
        for (var f = 0; f < data.value.length; f++) {
          const s = data.value[f];
          if(h.id === s){
            selection.push({...h});
          }
        }
      }
      this.setState({selected: data.value});
      if(onSelected!==undefined){
        onSelected(selection);
      }
    }else{
      if(data.value === null){
        this.setState({selected: null})
        if(onSelected!==undefined){
          onSelected({
            id: null
          });
        }
      }else{
        for (let i = 0; i < domains.data[schema].length; i++) {
          let h = domains.data[schema][i];
          if(h.id === data.value){
            this.setState({selected: h.id});
            if(onSelected!==undefined){
              onSelected({...h});
            }
            break;
          }
        }
      }
    }
  }

  render() {
    const {
      domains,
      schema,
      t,
      search,
      multiple
    } = this.props, {
        selected
    } = this.state;
    if(!domains.data.hasOwnProperty(schema)){
      if(domains.isFetching === true){
        return 'loading translations';
      }
      return (
        <div style={{color: 'red'}}>
          "{schema}" not in codelist
        </div>
      );
    }
    let options = [];
    if (this.props.reset){
      options.push({
        key: "dom-opt-z",
        value: null,
        text: '',
        content: <span
          style={{
            color: 'red'
          }}  
        >
          {t('reset')}
        </span>
      });
    }
    options = _.concat(options, domains.data[schema].map((domain) => ({
      key: "dom-opt-" + domain.id,
      value: domain.id,
      text: domain.code === ''?
        domain[this.state.language].text:
        domain.code !== domain[this.state.language].text?
          domain.code + ' (' + domain[this.state.language].text + ')': domain.code,
      content: <Header
        content={
          <div
            style={{
              borderLeft: domain.conf !== null?
                domain.conf.hasOwnProperty('color')?
                  '1em solid rgb(' +
                  domain.conf.color[0] + ", " +
                  domain.conf.color[1] + ", " +
                  domain.conf.color[2] + ")": null
                : null,
              paddingLeft: domain.conf !== null?
                domain.conf.hasOwnProperty('color')?
                  '0.5em': null
                : null
            }}
          >
            {
              domain.code === ''?
                domain[this.state.language].text:
                domain.code
            }
          </div>
        }
        style={{
          backgroundImage: domain.conf !== null?
            domain.conf.hasOwnProperty('img')?
              'url("' + process.env.PUBLIC_URL + '/img/lit/' +
              domain.conf.img + '")': null
            : null
        }}
        subheader={
          domain[
            this.state.language
          ].descr !== null
          && domain[
            this.state.language
          ].descr !== ''?
            domain[this.state.language].text + ', ' +  domain[this.state.language].descr:
            domain.code === ''?
              null: domain[this.state.language].text
        }
      />
    })));
    return (
      <Form.Select
        fluid={true}
        search={search}
        multiple={multiple}
        options={options}
        value={selected}
        onChange={this.handleChange}/>
    );
  }
};

DomainDropdown.propTypes = {
  schema: PropTypes.string,
  selected: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  onSelected: PropTypes.func,
  search: PropTypes.bool,
  multiple: PropTypes.bool,
  reset: PropTypes.bool
};

DomainDropdown.defaultProps = {
  search: true,
  multiple: false,
  reset: true
};

const mapStateToProps = (state, ownProps) => {
  return {
    domains: state.core_domain_list
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch,
    loadDomains: () => {
      dispatch(loadDomains());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((
   translate('common')(DomainDropdown)
));
