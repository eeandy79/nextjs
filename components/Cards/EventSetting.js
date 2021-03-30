import React, { useState, useEffect } from "react";

// components
import { useAuth0 } from "@auth0/auth0-react";
import console from "console"
import Editor from "utils/editor.js"
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router'

const UPDATE_USERS = gql`
  mutation update_users($_set: users_set_input, $where: users_bool_exp!) {
    update_users(_set: $_set, where: $where) {
	returning {
        id
        desc
      }
    }
  }
`;

const client = new ApolloClient({
	uri: "https://square-swan-44.hasura.app/v1/graphql",
	cache: new InMemoryCache()
});

export default function EventSetting() {
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	const [userMetadata, setUserMetadata] = useState(null);
	const [accessToken, setAccessToken] = useState(null);
	const [user, setUser] = useState(null);
	const [editor, setEditor] = useState(null);
	const [eventTitle, setEventTitle] = useState("");
	const [eventDetails, setEventDetails] = useState(null);
	const router = useRouter();

	const [updateUsers] = useMutation(UPDATE_USERS, { client: client} );

	const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	var save = () => {
		updateUsers({
			variables: {_set: { desc: JSON.stringify(editor.getContents()) }, where: {}},
			context: {
				headers: {
					Authorization: "Bearer " + accessToken
				}
			}
		}).then(result => console.log(result));
	};

	useEffect(() => {
		const getUserMetadata = async () => {
			const domain = process.env.NEXT_PUBLIC_DOMAIN;

			try {
				const token = await getAccessTokenSilently({
					audience: `https://${domain}/api/v2/`,
					scope: "read:current_user",
				});
				//console.log(token);
				setAccessToken(token);

				client.query({
					context: {
						headers: {
							Authorization: "Bearer " + token
						}
					},
					query: gql`
						query {
							users {
								id
								email
								desc
							}
						}
					`
				}).then((result) => {
					setUser(result["data"]["users"][0]);
				});

			} catch (e) {
				console.log("error: " + e.message);
			}
		};

		getUserMetadata();

	}, []);

	useEffect(() => {
			/*
		if (user && editor) {
			console.log("user:");
			editor.setContents(user["desc"]);
		}
		*/
		var query = router.query;
		if (query && query.hasOwnProperty("event_id") && accessToken) {
				const {event_id} = query;

				const query_event = gql`
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

				client.query({
					context: {
						headers: {
							Authorization: "Bearer " + accessToken
						}
					},
					variables: { where: {id: {_eq: event_id}}},
					query: query_event
				}).then((result) => {
						var _e = result["data"]["events"][0];
						console.log(_e["desc"]);
						setEventDetails(_e);
						editor.setContents(_e["desc"]);
				});
		}
	}, [editor, user, router]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
        <div className="rounded-t bg-white mb-0 px-4 py-3">
          <div className="text-center flex justify-between">
            <h6 className="text-gray-800 text-xl font-bold">Event Configuration</h6>
						<div>
						<button
              className="bg-gray-800 active:bg-gray-700 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
	          	onClick={save}
            >
						Save
            </button>
						<button
              className="bg-gray-800 active:bg-gray-700 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
	          	onClick={()=>{
								router.push({
									pathname: '/admin/tables',
								})
							}}
            >
						Back
            </button>
						</div>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              General Information
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Event Title
                  </label>
                  <input
                    type="text"
                    className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
										value={eventDetails ? eventDetails["title"] : ""}
										placeholder=""
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Start Time
                  </label>
                  <input
                    type="text"
                    className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                    defaultValue="xxx"
                  />

	            </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    End Time
                  </label>
                  <input
                    type="text"
                    className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                    defaultValue="yyy"
                  />
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-gray-400" />
            <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              Event Description
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <Editor
	                ref={(el) => {setEditor(el)}}
                    className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                  >
                  </Editor>
	            </div>
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-4">
				<button
					className="bg-gray-800 active:bg-gray-700 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
					type="button"
	  				onClick={save}
				>
				Save
				</button>
			  </div>
	        </div>
          </form>
        </div>
      </div>
    </>
  );
}
