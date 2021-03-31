import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import console from "console"
import Editor from "utils/editor.js"
import HasuraProxy from "utils/hasura_proxy.js"
import { useRouter } from 'next/router'
import { LoadingOverlay, Loader } from "react-overlay-loader";
import 'react-overlay-loader/styles.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const proxy = new HasuraProxy("https://square-swan-44.hasura.app/v1/graphql");

export default function EventSetting() {
	const router = useRouter();
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	const [accessToken, setAccessToken] = useState(null);
	const [editor, setEditor] = useState(null);
	const [eventDetails, setEventDetails] = useState(null);
	const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	var save = () => {
    setIsLoading(true);
    setSaving(true);
		var _e = Object.assign({}, eventDetails);
		_e["desc"] = JSON.stringify(editor.getContents());
		proxy.updateEvent(_e, accessToken).then(result => console.log(result));
    setIsLoading(false);
    setSaving(false);
    NotificationManager.success('Success', 'Save', 750);
	};

	useEffect(() => {
		const getToken = async () => {
			const domain = process.env.NEXT_PUBLIC_DOMAIN;

			try {
				const token = await getAccessTokenSilently({
					audience: `https://${domain}/api/v2/`,
					scope: "read:current_user",
				});
				setAccessToken(token);
				console.log(token);

			} catch (e) {
				console.log("error: " + e.message);
			}
		};
		getToken();
	}, []);

	useEffect(() => {
		var query = router.query;
		if (query && query.hasOwnProperty("event_id") && accessToken) {
				const {event_id} = query;
				try {
					proxy.getEvent(event_id, accessToken).then((result) => {
							var _e = result["data"]["events"][0];
							setEventDetails(_e);
							editor.setContents(_e["desc"]);
					});
          setIsLoading(false);
				} catch (e) {
					console.log("error: " + e.message);
				}
		}
	}, [editor, router, proxy, accessToken]);

  return (
    <>
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
        <NotificationContainer/>
        <div className="rounded-t bg-white mb-0 px-4 py-3">
          <Loader loading={isLoading} text="processing"/>
          <div className="text-center flex justify-between">
            <h6 className="text-gray-800 text-xl font-bold">Event Configuration</h6>
						<div>
						<button
              className="bg-gray-800 active:bg-gray-700 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              disabled={saving}
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
                    onChange={()=>{}}
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
			  </div>
	        </div>
          </form>
        </div>
      </div>
    </>
  );
}
