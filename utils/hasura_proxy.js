import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql, useMutation } from '@apollo/client';

const UPDATE_EVENT = gql`
	mutation update_events($_set: events_set_input, $where: events_bool_exp!) {
		update_events(_set: $_set, where: $where) {
			returning {
				id
				desc
				end_datetime
				start_datetime
				title
			}
		}
	}
`;

const QUERY_EVENTS = gql`
query query_events($where: events_bool_exp) {
		events(where: $where) {
				desc
				end_datetime
				id
				start_datetime
				title
		}
}
`;

export default class HasuraProxy {
  static _instance = null;
	constructor(uri) {
		this._client= new ApolloClient({
			uri: uri,
			cache: new InMemoryCache()
		});
	}

  static getInstance() {
    if (HasuraProxy._intance == null) {
      HasuraProxy._instance = new HasuraProxy("https://square-swan-44.hasura.app/v1/graphql");
    }
    return this._instance;
  }

	getEvents(accessToken) {
		return this._client.query({
			context: {
				headers: {
					Authorization: "Bearer " + accessToken
				}
			},
			variables: { where: {}},
			query: QUERY_EVENTS
		});
	}

	getEvent(event_id, accessToken) {
		return this._client.query({
			context: {
				headers: {
					Authorization: "Bearer " + accessToken
				}
			},
			variables: { where: {id: {_eq: event_id}}},
			query: QUERY_EVENTS
		});
	}

	updateEvent(eventDetails, accessToken) {
		return this._client.mutate({
			context: {
				headers: {
					Authorization: "Bearer " + accessToken
				}
			},
			variables: {
        _set: {
          title: eventDetails["title"],
          start_datetime: eventDetails["start_datetime"],
          end_datetime: eventDetails["end_datetime"],
          desc: eventDetails["desc"]
        },
        where: {
          id: {_eq: eventDetails["id"]}
        }
      },
			mutation: UPDATE_EVENT
		});
	}

  resetStore() {
		this._client.resetStore();
	}
};


