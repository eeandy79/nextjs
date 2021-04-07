import React, { useState, useEffect } from "react";
import Link from "next/link";
import HasuraProxy from "utils/hasura_proxy.js"

// components
import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import Editor from "utils/editor.js"
import ReactHtmlParser from "react-html-parser";

const proxy = HasuraProxy.getInstance();

export default function EventPage(input) {
  const [iFrame, setIFrame] = useState("");
	const [editor, setEditor] = useState(null);

  var event_id = input["event_id"]; // todo: handle eventid not valid

  useEffect(() => {
    if (editor) {
      try {
        proxy.getEvent(event_id, null).then((result) => {
          var _e = result["data"]["events_by_pk"];
          console.log(_e);
          //setEventDetails(_e);
          //console.log(_e);
          //setTitle(_e["title"]);
          //setStartTime(moment(_e["start_datetime"]));
          //setEndTime(moment(_e["end_datetime"]));
          setIFrame(_e["video_iframe"]);
          editor.setContents(_e["desc"]);
        });

      } catch (e) {
        console.log("error: " + e.message);
      }
    }
  }, [editor]);

  return (
	  <>
    <Navbar/>
    <main>
    {/*
    <div className="relative pt-16 pb-32 flex flex-col content-center items-center justify-center min-h-screen-75">
    */}
    <div className="pt-16 pb-32 flex flex-col content-center items-center min-h-screen-75 w-full">
      {/*
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
      */}
      <div className="container px-4">
        <div className="flex py-4 w-full">
          {/*
          <div className="flex-grow bg-blue pr-4" height="200%">
          */}
          <div className="flex w-full">
            <div className="video">
              { ReactHtmlParser(iFrame) }
            </div>
          </div>
          <div className="flex md:w-4/12 bg-black text-gray-700">
          abcdefdk
          </div>
        </div>
        <div className="flex">
          <Editor
            ref={(el) => {setEditor(el)}}
            className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
            readonly="true"
            toolbar="false"
            >
          </Editor>
        </div>
      </div>
    </div>
    </main>
    <Footer />
    </>
  );
}
