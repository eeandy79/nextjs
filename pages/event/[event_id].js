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
import { useCookies } from "react-cookie";

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
  const [requireLogin, setRequireLogin] = useState(true);
  const [isEventLoaded, setIsEventLoaded] = useState(false);
  const [protectContext, setProtectContext] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const router = useRouter();

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
        setSubmitting(false);
        setFormData({reset:true});
        setRequireLogin(false);

        let expires = new Date()
        expires.setTime(expires.getTime() + (60 * 1000))
        setCookie("accessToken", "bcde", {
          path: "/",
          expires: expires,
          sameSite: true,
        })

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
          console.log(_e);
          setTitle(_e["title"]);
          setStartTime(moment(_e["start_datetime"]));
          setEndTime(moment(_e["end_datetime"]));
          setIFrame(_e["video_iframe"]);
          setContent(_e["desc"]);

          var ctx = _e["protect_context"];
          setProtectContext(ctx);

          if (cookies.accessToken) {
            setRequireLogin(false);
          } else {
            setRequireLogin((ctx && ctx.hasOwnProperty("enable_protection"))?ctx["enable_protection"]:false);
          }

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

  if (requireLogin) {
  return (
    <>
    <main
      className="absolute bg-blue-400 w-full h-full bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage:
        "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')",
        }}
    >
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
    <form className="sm:rounded-lg sm:shadow-lg sm:w-1/2 bg-opacity-80 bg-gray-500 px-4 py-4 mx-4 my-4" onSubmit={handleSubmit} onChange={handleChange}>
        <div>
          <h4 className="text-2xl font-semibold">
            {title}
          </h4>
        </div>
        <div style={{marginTop:2}}>
          <p className="leading-relaxed text-sm text-gray-300" style={{marginTop:2}}>
            Please enter your passcode(*just click submit now*):
          </p>
          <input
            name="passcode"
            type="text"
            className="px-3 py-3 placeholder-gray-300 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
            placeholder="Your Passcode"
            value={formData.passcode || ''}
            onChange={()=>{}}
          />
        </div>
        <div style={{marginTop:2}}>
          <p className="leading-relaxed text-sm text-gray-300" style={{marginTop:2}}>
            Please enter your name:
          </p>
          <input
            name="name"
            type="text"
            className="px-3 py-3 placeholder-gray-300 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
            placeholder="Your Name"
            value={formData.name || ''}
            onChange={()=>{}}
          />
        </div>
        <div style={{marginTop:2}}>
          <input className="form-checkbox rounded" type="checkbox" name="terms" onChange={handleChange} checked={formData["terms"] || false}/>
          <span className="px-2 align-middle text-sm text-gray-300">Accept the condition</span>
        </div>
        <div style={{marginTop:10}}>
          <button
            className="bg-gray-800 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:bg-red-700 hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
    <Navbar event_id={eventID} have_protection={protectContext.hasOwnProperty("enable_protection")?protectContext["enable_protection"]:false}/>
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
