import _ from 'lodash';

const initialState = {
  isFetching: false,
  pathching: [],
  rtime: 0, // fetch time
  fcnt: 0, // fetch counter
  scrollbar: '10px',
  page: 0,
  data: {
    boreholetable: {
      orderby: null,
      direction: null
    },
    appearance: {
      explorer: 'mode-1'
    },
    filter: {
      mapfilter: true,
      zoom2selected: true,
      kind: true,
      restriction: true,
      "restriction_until": true,
      "location_x": true,
      "location_y": true,
      srs: true,
      "elevation_z": true,
      hrs: true,
      "drilling_date": true,
      "bore_inc": true,
      "bore_inc_dir": true,
      length: true,
      extended: {
        "original_name": true,
        method: true,
        purpose: true,
        status: true,
        "top_bedrock": true,
        groundwater: true
      },
      custom: {
        "public_name": true,
        "project_name": true,
        canton: true,
        city: true,
        address: true,
        landuse: true,
        cuttings: true,
        "drill_diameter": true,
        "lit_pet_top_bedrock": true,
        "lit_str_top_bedrock": true,
        "chro_str_top_bedrock": true,
        remarks: true,
        mistakes: true,
        "processing_status": true,
        "national_relevance": true,
        "attributes_to_edit": true
      }
    },
    efilter: {
      kind: true,
      restriction: true,
      "restriction_until": true,
      "elevation_z": true,
      hrs: true,
      "drilling_date": true,
      "bore_inc": true,
      "bore_inc_dir": true,
      length: true,
      extended: {
        "original_name": true,
        method: true,
        purpose: true,
        status: true,
        "top_bedrock": true,
        groundwater: true
      },
      custom: {
        "public_name": true,
        "project_name": true,
        canton: true,
        city: true,
        address: true,
        landuse: true,
        cuttings: true,
        "drill_diameter": true,
        "lit_pet_top_bedrock": true,
        "lit_str_top_bedrock": true,
        "chro_str_top_bedrock": true,
        remarks: true,
        mistakes: true,
        "processing_status": true,
        "national_relevance": true,
        "attributes_to_edit": true
      }
    }
  }
};

const setting = (state = initialState, action) => {
  const { path } = action;
  if (path === '/setting') {
    switch (action.type) {
      case 'GET': {
        return {
          ...initialState,
          rtime: (
            new Date()
          ).getTime(),
          isFetching: true
        };
      }
      case 'GET_OK': {
        let copy = {
          ...state,
          fcnt: (state.fcnt + 1),
          isFetching: false,
          rtime: (
            new Date()
          ).getTime() - state.rtime,
          data: _.merge(state.data, action.json.data)
        };
        return copy;
      }
      case 'PATCH': {
        const copy = { ...state };
        let path = null;
        if (_.has(action, 'key')){
          path = _.union(
            ['data'],
            action.tree.split('.'),
            [action.key]
          );
        } else {
          path = _.union(
            ['data'],
            action.tree.split('.')
          );
        }
        if (action.value === null){
          _.unset(
            copy, path, action.value
          );
        } else {
          _.set(
            copy, path, action.value
          );
        }
        return copy;
      }
      default:
        return state;
    }
  }
  switch (action.type) {
    case 'SETTING_TOGGLE_FILTER': {
      const copy = { ...state };
      _.set(
        copy, `data.filter.${action.filter}`, action.enabled
      );
      return copy;
    }
    case 'SETTING_SCROLLBAR_WIDTH': {
      return {
        ...state,
        scrollbar: action.width
      };
    }
    case 'SETTING_SET_PAGE': {
      return {
        ...state,
        page: action.page
      };
    }
    default:
      return state;
  }
};

export default setting;
