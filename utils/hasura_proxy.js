import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql, useMutation } from '@apollo/client';

const UPDATE_EVENT = gql`
	mutation update_events($_set: events_set_input, $where: events_bool_exp!) {
		update_events(_set: $_set, where: $where) {
			returning {
				desc
				end_datetime
				id
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
	constructor(uri) {
		this._client= new ApolloClient({
			uri: uri,
			cache: new InMemoryCache()
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
			variables: { _set: { desc: eventDetails["desc"] }, where: {id: {_eq: eventDetails["id"]}}},
			mutation: UPDATE_EVENT
		});
	}

  resetStore() {
		this._client.resetStore();
	}
};


