import _ from 'lodash';

const initialState = {
  "isFetching": false,
  "filter": {
    "refresh": 1,
    "role": 'all',
    "workgroup": 'all',
    "original_name": '',
    "public_name": '',
    "kind": null,
    "method": null,
    "restriction": null,
    "project_name": '',
    "landuse": null,
    "restriction_until_from": '',
    "restriction_until_to": '',
    "elevation_z_from": '',
    "elevation_z_to": '',
    "length_from": '',
    "length_to": '',
    "groundwater": -1,
    "top_bedrock_from": '',
    "top_bedrock_to": '',
    "status": null,
    "purpose": null,
    "cuttings": null,
    "drilling_date_from": '',
    "drilling_date_to": '',
    "drill_diameter_from": '',
    "drill_diameter_to": '',
    "bore_inc_from": '',
    "bore_inc_to": '',
    "bore_inc_dir_from": '',
    "bore_inc_dir_to": '',
    "lit_pet_top_bedrock": null,
    "lit_str_top_bedrock": null,
    "chro_str_top_bedrock": null,
    "canton": null,
    "municipality": null,
    "address": '',

    "project": null,
    "last_update": '',
    "creation": '',
    "completness": 'all'
  }
};

const searchEditor = (
  state = {
    ...initialState,
    filter: {
      ...initialState.filter
    }
  }, action) => {
  switch (action.type) {
    case 'SEARCH_EDITOR_FILTER_CHANGED': {
      const copy = { ...state };
      const path = `filter.${action.key}`;
      if (_.has(copy, path)) {
        if (_.isNil(action.value) || action.value === '') {
          if (_.isString(action.value)) {
            _.set(copy, path, '');
          } else {
            _.set(copy, path, null);
          }
        } else {
          _.set(copy, path, action.value);
        }
      }
      return copy;
    }
    case 'SEARCH_EDITOR_FILTER_RESET_RESTRICTION': {
      const copy = { ...state };
      copy.filter.restriction_until_from = '';
      copy.filter.restriction_until_to = '';
      return copy;
    }
    case 'SEARCH_EDITOR_FILTER_RESET_ELEVATION': {
      const copy = { ...state };
      copy.filter.elevation_z_from = '';
      copy.filter.elevation_z_to = '';
      return copy;
    }
    case 'SEARCH_EDITOR_FILTER_RESET_TOP_BEDROCK': {
      const copy = { ...state };
      copy.filter.top_bedrock_from = '';
      copy.filter.top_bedrock_to = '';
      return copy;
    }
    case 'SEARCH_EDITOR_FILTER_REFRESH': {
      const copy = { ...state };
      copy.filter.refresh = copy.filter.refresh + 1;
      return copy;
    }
    case 'SEARCH_EDITOR_FILTER_RESET_DRILLING': {
      const copy = { ...state };
      copy.filter.drilling_date_from = '';
      copy.filter.drilling_date_to = '';
      return copy;
    }
    case 'SEARCH_EDITOR_FILTER_RESET_DRILL_DIAMETER': {
      const copy = { ...state };
      copy.filter.drill_diameter_from = '';
      copy.filter.drill_diameter_to = '';
      return copy;
    }
    case 'SEARCH_EDITOR_FILTER_RESET_BORE_INC': {
      const copy = { ...state };
      copy.filter.bore_inc_from = '';
      copy.filter.bore_inc_to = '';
      return copy;
    }
    case 'SEARCH_EDITOR_FILTER_RESET_BORE_INC_DIR': {
      const copy = { ...state };
      copy.filter.bore_inc_dir_from = '';
      copy.filter.bore_inc_dir_to = '';
      return copy;
    }

    case 'SEARCH_EDITOR_FILTER_RESET': {
      return {
        ...state,
        filter: {
          ...initialState.filter
        }
      };
    }
    case 'SEARCH_EDITOR_COMPLETNESS_CHANGED': {
      return {
        ...state,
        filter: {
          ...state.filter,
          completness: action.completness
        }
      };
    }
    case 'SEARCH_EDITOR_PROJECT_CHANGED': {
      return {
        ...state,
        filter: {
          ...state.filter,
          project: action.id
        }
      };
    }
    case 'SEARCH_EDITOR_LASTUPDATE_CHANGED': {
      return {
        ...state,
        filter: {
          ...state.filter,
          last_update: action.date
        }
      };
    }
    case 'SEARCH_EDITOR_CREATION_CHANGED': {
      return {
        ...state,
        filter: {
          ...state.filter,
          creation: action.date
        }
      };
    }
    default:
      return state;
  }
};

export default searchEditor;
