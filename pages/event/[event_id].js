import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HasuraProxy from "utils/hasura_proxy.js"

// components
import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import Editor from "utils/editor.js"
import ReactHtmlParser from "react-html-parser";
import moment from "moment";

const proxy = HasuraProxy.getInstance();

export default function EventPage() {
  const [iFrame, setIFrame] = useState("");
	const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [eventID, setEventID] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { event_id } = router.query; // todo: handle eventid not valid
    setEventID(event_id);
  },[router]);

  useEffect(() => {
    if (editor) {
      try {
        proxy.getEvent(eventID, null).then((result) => {
          var _e = result["data"]["events_by_pk"];
          //console.log(_e);
          setTitle(_e["title"]);
          setStartTime(moment(_e["start_datetime"]));
          setEndTime(moment(_e["end_datetime"]));
          setIFrame(_e["video_iframe"]);
          editor.setContents(_e["desc"]);
        });

      } catch (e) {
        console.log("error: " + e.message);
      }
    }
  }, [editor, eventID]);

  return (
	  <>
    <Navbar event_id={eventID}/>
    <main>
    <div className="relative pt-16 pb-32 flex flex-col content-center items-center min-h-screen-75">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row py-4">
          <div className="flex w-full lg:w-8/12">
            <div className="video">
              { ReactHtmlParser(iFrame) }
            </div>
          </div>
          <div className="flex lg:w-4/12 bg-black">
            <div className="flex flex-col">
              <div className="flex flex-row px-3 mt-3">
                {
                  (startTime && endTime) ?
                  (
                    <>
                    <div className="start-date-label mr-1">
                      <span className="day">{startTime.format("MMM")}</span>
                      <span className="day">{startTime.format("DD")}</span>
                    </div>
                    <div className="text-white text-sm mt-1 mr-1">
                      {startTime.format("HH:mm")} -
                    </div>
                    {
                      // show date bubble if start != end date
                      startTime.isSame(endTime, 'day') ?
                      (""):
                      (
                        <div className="start-date-label mr-1">
                          <span className="day">{endTime.format("MMM")}</span>
                          <span className="day">{endTime.format("DD")}</span>
                        </div>
                      )
                    }
                    <div className="text-white text-sm mt-1">
                      {endTime.format("HH:mm")}
                    </div>
                    </>
                  ):("")
                }
                </div>
              <div>
                <h1 className="text-white text-lg px-3 py-3 font-bold">
                  {title}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          {
            eventID ? (
            <Editor
              ref={(el) => {setEditor(el)}}
              className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
              readonly="true"
              toolbar="false"
              theme="bubble"
              />
            ):("")
          }
        </div>
      </div>
    </div>
    </main>
    <Footer />
    </>
  );
}
