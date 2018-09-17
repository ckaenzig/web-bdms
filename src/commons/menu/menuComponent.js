import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import _ from 'lodash'

import {
  List,
  Icon,
  Dropdown
} from 'semantic-ui-react'

class MenuComponent extends React.Component {
  render() {
    const {
      i18n, t, handleModeChange, mode
    } = this.props
    return (
      <div style={{
        flex: '1 1 0%',
        display: 'flex',
        height: '100%',
        flexDirection: 'column'
      }}>
      <List divided verticalAlign='middle'>
          <List.Item
            style={{
              padding: '1em',
              backgroundColor: 'black',
              color: 'white'
            }}>
            <List.Content floated='right'>
              <Dropdown trigger={
                <span
                  style={{
                    // color: '#787878'
                    color: 'rgb(222, 222, 222)'
                  }}
                >
                  change
                </span>
              } options={(()=>{
                let opts = []
                if (mode !== 'viewer'){
                  opts.push({
                    key: 'viewer',
                    text: 'Exporer Mode',
                    icon: 'binoculars',
                    onClick: () => {
                      if(_.isFunction(handleModeChange)){
                        handleModeChange('viewer')
                      }
                    }
                  })
                }
                if (mode !== 'editor'){
                  opts.push({
                    key: 'editor',
                    text: 'Editor Mode',
                    icon: 'edit',
                    onClick: () => {
                      if(_.isFunction(handleModeChange)){
                        handleModeChange('editor')
                      }
                    }
                  })
                }
                return opts
              })()} />
            </List.Content>
            {
              mode === 'viewer'?
              <List.Content>
                <Icon name='binoculars' />
                Explorer Mode
              </List.Content>: 
              <List.Content>
                <Icon name='edit' />
                Editor Mode
              </List.Content>
            }
          </List.Item>
        </List>
        <div style={{ flex: 1 }}>
          {this.props.children}
        </div>
        <List
          divided
          verticalAlign='middle'
        >
          <List.Item
            style={{
              padding: '1em',
              backgroundColor: '#dedede',
              // color: 'white'
            }}>
            <List.Content floated='right'>
              <Dropdown
                  trigger={
                    <span>
                      {t('header:language')}
                    </span>
                  }
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={()=>{
                        i18n.changeLanguage('en')
                      }}>English</Dropdown.Item>
                    <Dropdown.Item
                      onClick={()=>{
                        i18n.changeLanguage('en')
                      }}>Deutsch</Dropdown.Item>
                    <Dropdown.Item
                      onClick={()=>{
                        i18n.changeLanguage('en')
                      }}>Français</Dropdown.Item>
                    <Dropdown.Item
                      onClick={()=>{
                        i18n.changeLanguage('it')
                      }}>Italiano</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            </List.Content>
            <List.Content>
              <Icon name='setting' />
              Settings
            </List.Content>
          </List.Item>
        </List>
    </div>
    )
  }
}

MenuComponent.propTypes = {
  handleModeChange: PropTypes.func,
  mode: PropTypes.string
}

export default translate(['common', 'header'])(MenuComponent)
