import React, { useReducer, useState, useEffect } from "react";
import { useRouter } from "next/router";
import HasuraProxy from "utils/hasura_proxy.js"

// components
import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import Editor from "utils/editor.js"
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import { LoadingOverlay, Loader } from "react-overlay-loader";
import 'react-overlay-loader/styles.css';

const proxy = HasuraProxy.getInstance();

const formReducer = (state, event) => {
  if (event.reset) {
    return {
      passcode: '',
      name: '',
      'terms': false,
    }
  }
  return {
    ...state,
      [event.name]: event.value
  }
}

export default function EventPage() {
  const [iFrame, setIFrame] = useState("");
	const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [content, setContent] = useState(null);
  const [eventID, setEventID] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [isLogin, setIsLogin] = useState(false);
  const [isEventLoaded, setIsEventLoaded] = useState(false);
  const router = useRouter();

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
        setSubmitting(false);
        setFormData({reset:true});
        setIsLogin(true);
        }, 1000)
    // alert('You have submitted the form.')
  }

  const handleChange = event => {
    const isCheckbox = event.target.type === 'checkbox';
    setFormData({
      name: event.target.name,
      value: isCheckbox ? event.target.checked : event.target.value,
    });
  }

  useEffect(() => {
    const { event_id } = router.query; // todo: handle eventid not valid
    if (event_id) {
      setEventID(event_id);
      try {
        proxy.getEvent(event_id, null).then((result) => {
          var _e = result["data"]["events_by_pk"];
          //console.log(_e);
          setTitle(_e["title"]);
          setStartTime(moment(_e["start_datetime"]));
          setEndTime(moment(_e["end_datetime"]));
          setIFrame(_e["video_iframe"]);
          setContent(_e["desc"]);
          setIsEventLoaded(true);
        });
      } catch (e) {
        console.log("error: " + e.message);
      }
    }

  },[router]);

  useEffect(() => {
    if (editor && isEventLoaded) {
      editor.setContents(content);
    }
  }, [editor, isEventLoaded]);

  if (!isEventLoaded || submitting) {
    return (
      <>
        <Loader loading text="Loading ..."/>
      </>
    )
  }

  if (!isLogin) {
  return (
    <>
    <main className="absolute bg-blue-400 w-full h-full">
      {
        submitting &&
        <div>
          u are submitting the following:
          <ul>
          {Object.entries(formData).map(([name, value]) => (
                <li key={name}><strong>{name}</strong>:{value.toString()}</li>
                ))}
          </ul>
        </div>
      }
    <form className="rounded-lg shadow-lg bg-opacity-50 bg-gray-300 px-4 py-4" style={{width:500, marginLeft:100, marginTop:100}} onSubmit={handleSubmit} onChange={handleChange}>
        <div>
          <h4 className="text-2xl font-semibold">
            {title}
          </h4>
        </div>
        <div style={{marginTop:2}}>
          <p className="leading-relaxed text-sm text-gray-700" style={{marginTop:2}}>
            Please enter your passcode(*just click submit now*):
          </p>
          <input
            name="passcode"
            type="text"
            className="px-3 py-3 placeholder-gray-100 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
            placeholder="Your Passcode"
            value={formData.passcode || ''}
          />
        </div>
        <div style={{marginTop:2}}>
          <p className="leading-relaxed text-sm text-gray-700" style={{marginTop:2}}>
            Please enter your name:
          </p>
          <input
            name="name"
            type="text"
            className="px-3 py-3 placeholder-gray-100 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
            placeholder="Your Name"
            value={formData.name || ''}
          />
        </div>
        <div style={{marginTop:2}}>
          <input className="form-checkbox" type="checkbox" name="terms" onChange={handleChange} checked={formData["terms"] || false}/>
          <span className="px-2 align-middle text-sm text-gray-700">Accept the condition</span>
        </div>
        <div style={{marginTop:10}}>
          <button
            className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="submit"
            >
            Submit
          </button>
        </div>
      </form>
    </main>
    </>
  )
  }

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
