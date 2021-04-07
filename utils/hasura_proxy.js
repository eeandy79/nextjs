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
      video_iframe
    }
  }
}
`;

const QUERY_EVENTS = gql`
query query_events($where: events_bool_exp) {
  events(where: $where) {
    id
    title
    desc
    created_at
    start_datetime
    end_datetime
    video_iframe
  }
}
`;

const INSERT_EVENT_ONE = gql`
mutation insert_events_one($object: events_insert_input!) {
  insert_events_one(object: $object) {
    id
  }
}
`;

const DELETE_EVENT_ONE = gql`
mutation delete_events_by_pk($id: uuid!) {
  delete_events_by_pk(id: $id) {
    id
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
    if (HasuraProxy._instance == null) {
      console.log("make hasura proxy");
      HasuraProxy._instance = new HasuraProxy("https://major-mole-59.hasura.app/v1/graphql");
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

  deleteEvent(event_id, accessToken) {
    var rv = this._client.mutate({
      context: {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      },
      variables: {
        id: event_id
      },
      mutation: DELETE_EVENT_ONE
    });
    this._client.resetStore();
    return rv;
  }

  insertEvent(user_id, eventDetails, accessToken) {
    var rv = this._client.mutate({
      context: {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      },
      variables: {
        object: {
          title: eventDetails["title"],
          start_datetime: eventDetails["start_datetime"],
          end_datetime: eventDetails["end_datetime"],
          desc: eventDetails["desc"],
          video_iframe: eventDetails["video_iframe"],
          user_id: user_id
        }
      },
      mutation: INSERT_EVENT_ONE
    });
    this._client.resetStore();
    return rv;
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
          desc: eventDetails["desc"],
          video_iframe: eventDetails["video_iframe"]
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


