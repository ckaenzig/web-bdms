import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import {
  getdBoreholeIds,
  deleteBoreholes
} from '@ist-supsi/bmsjs';

import {
  Table,
  Pagination,
  Segment,
  Button,
} from 'semantic-ui-react'

class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.delay = false;
    this.uid = _.uniqueId();
    this.add2selection = this.add2selection.bind(this);
    this.inSelection = this.inSelection.bind(this);
    this.deleteList = this.deleteList.bind(this);
    const {
      activeItem,
      filter
    } = this.props;
    this.state = {
      activeItem: activeItem !== undefined ? activeItem : null,
      filter: filter !== undefined ? filter : {},
      selected: [],
      all: false
    };
  }
  componentDidMount() {
    const {
      filter
    } = this.props;
    this.props.loadData(1, filter); //, setting.orderby, setting.direction);
  }
  componentDidUpdate(prevProps) {
    const {
      filter
    } = this.props;
    if (!_.isEqual(filter, prevProps.filter)) {
      if (this.delay) {
        clearTimeout(this.delay);
        this.delay = false;
      }
      this.setState({
        selected: [],
        all: false
      }, () => {
        this.delay = setTimeout(function () {
          this.props.loadData(1, filter); //, setting.orderby, setting.direction);
        }.bind(this), 10);
      });
    }
  }
  handleClick(selected) {
    const {
      onSelected
    } = this.props;
    if (this.state.activeItem === selected.id) {
      if (onSelected !== undefined) {
        onSelected(null);
      }
      this.setState({ activeItem: null });
    } else {
      if (onSelected !== undefined) {
        onSelected(selected);
      }
      this.setState({ activeItem: selected.id });
    }
  }
  handleMultipleClick() {
    const {
      filter,
      onMultiple
    } = this.props;
    if (this.state.all === true || this.state.selected.length > 0) {
      // Load selected id if all is true
      if (onMultiple !== undefined) {
        if (this.state.all === true) {
          getdBoreholeIds(filter).then((response) => {
            if (
              response.data.success
            ) {
              onMultiple(
                _.pullAll(response.data.data, this.state.selected)
              );
            }
          }).catch((err) => {
            console.log(err);
          });
        } else {
          onMultiple(this.state.selected);
        }
      }
    }
  }
  handleHover(selected) {
    const {
      onHover
    } = this.props;
    if (onHover !== undefined) {
      onHover(selected);
    }
  }
  deleteList() {
    const {
      filter
    } = this.props;
    if (this.state.all === true || this.state.selected.length > 0) {
      if (this.state.all === true) {
        getdBoreholeIds(filter).then((response) => {
          if (
            response.data.success
          ) {
            deleteBoreholes(
              _.pullAll(response.data.data, this.state.selected)
            ).then(() => {
              this.setState({
                selected: [],
                all: false
              }, () => {
                this.props.loadData(1, filter);
              });
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      } else {
        deleteBoreholes(
          this.state.selected
        ).then(() => {
          this.setState({
            selected: [],
            all: false
          }, () => {
            this.props.loadData(1, filter);
          });
        });
      }
    }
  }

  add2selection(id) {
    const {
      selected
    } = this.state;
    const tmp = [...selected];
    const index = tmp.indexOf(id);
    if (index >= 0) {
      tmp.splice(index, 1);
    } else {
      tmp.push(id);
    }
    this.setState({
      selected: tmp
    });
  }

  inSelection(id) {
    const {
      selected, all
    } = this.state;
    const index = selected.indexOf(id);
    if (all === true) {
      if (index >= 0) {
        return false;
      } else {
        return true;
      }
    } else {
      if (index >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  getHeader() {
    console.error("Please overwrite getHeader method");
  }

  getCols(item, idx) {
    console.error("Please overwrite getCols method");
  }

  render() {
    const {
      store,
      filter
    } = this.props, {
      activeItem,
      selected,
      all
    } = this.state;
    return (
      <Segment
        basic
        loading={store.isFetching}
        style={{
          flex: "1 1 100%",
          display: 'flex',
          flexDirection: 'column',
          // height: '100%',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          {
            all === true || selected.length > 0 ?
              <div
                style={{
                  backgroundColor: '#FFEB3B',
                  color: 'black',
                  textAlign: 'center',
                  padding: '0.5em'
                }}
              >
                <span
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  {
                    all === true ?
                      'All' :
                      selected.length === 1 ?
                        'One' :
                        selected.length
                  } borehole{
                    all === true || selected.length > 1 ?
                      's' : null
                  } selected.
                </span> (
                <span
                  onClick={() => {
                    this.setState({
                      selected: [],
                      all: false
                    });
                  }}
                  style={{
                    color: '#2196f3',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Reset selection
                </span>) <Button
                  color='black'
                  onClick={() => {
                    this.handleMultipleClick();
                  }}
                  size='mini'
                >
                  Bulk editing
                </Button> {
                  all === false && selected.length === 1 ?
                    <Button
                      primary
                      onClick={() => {
                        console.log('clone click');
                      }}
                      size='mini'
                    >
                      Clone
                  </Button> : null
                } <Button
                  negative
                  onClick={() => {
                    this.deleteList();
                  }}
                  size='mini'
                >
                  Delete
                </Button>
              </div> : null
          }
          <Table fixed compact='very' basic='very'>
            <Table.Header>
              {this.getHeader()}
            </Table.Header>
          </Table>
        </div>
        <div style={{
          flex: "1 1 0%",
          overflowY: 'auto',
          // border: 'thin solid #d2d2d2',
          // padding: '0px 1em'
        }}>
          <Table fixed compact='very' basic='very' selectable>
            <Table.Body>
              {
                store.data.map((item, idx) => (
                  <Table.Row
                    style={{
                      cursor: 'pointer'
                      // cursor: all === true || selected.length > 0 ?
                      //   'copy' : 'pointer'
                    }}
                    key={this.uid + "_" + idx}
                    active={
                      activeItem === item.id
                      || this.props.highlight === item.id
                    }
                    onClick={e => {
                      if (all === true || selected.length > 0) {
                        this.add2selection(item.id);
                      } else {
                        this.handleClick(item);
                      }
                    }}
                    onMouseEnter={e => this.handleHover(item)}
                    onMouseLeave={e => this.handleHover(null)}
                  >
                    {
                      this.getCols(item, idx)
                    }
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
        {
          store.pages > 1 ?
            <div style={{
              textAlign: 'center',
              padding: '1em 0px 0px 1em'
            }}>
              <Pagination
                secondary
                pointing
                activePage={store.page}
                onPageChange={(ev, data) => {
                  this.props.loadData(
                    data.activePage,
                    filter
                  );
                }}
                totalPages={store.pages} />
            </div> : null
        }
      </Segment>
    );
  }
}

TableComponent.propTypes = {
  filter: PropTypes.object,
  highlight: PropTypes.number,
  loadData: PropTypes.func,
  onSelected: PropTypes.func,
  onMultiple: PropTypes.func,
  onHover: PropTypes.func,
  setting: PropTypes.object
}

TableComponent.defaultProps = {
  name: 'Stranger',
  setting: {
    orderby: null,
    direction: null
  }
}

export default TableComponent;
