import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      setError(false);
      try {
        const res = await fetch(`/api/user/${listing?.userRef}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache", // Prevent caching
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }
        setLandlord(data);
      } catch (error) {
        setError(true);
      }
    };

    fetchLandlord();
  }, [listing?.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord?.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing?.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg"
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={(e) => handleChange(e)}
            placeholder="Enter your message here..."
          ></textarea>

          <Link
            className="bg-slate-700 text-white text-center p-3 rounded-md uppercase hover:opacity-95"
            to={`mailto:${landlord?.email}?subject=Regarding${listing?.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
