"use client";
import { useState } from "react";
import { FaCircleArrowUp } from "react-icons/fa6";

const Dashboard = () => {
  const [text, setText] = useState("");

  const handleChange = (event) => {
    const textarea = event.target;
    setText(textarea.value);

    // Adjust the height of the textarea dynamically
    textarea.style.height = "auto"; // Reset height to auto to shrink it if necessary
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to the scrollHeight to expand
  };

  return (
    <section className="md:w-10/12 w-full mx-auto relative">
      <form
        className="flex items-center relative"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative w-full">
          <textarea
            value={text}
            onChange={handleChange}
            className="w-full rounded-3xl focus:outline-none px-4 py-4 text-sm resize-none pr-14"
            placeholder="Message the system..."
            style={{ overflow: "hidden" }} // Prevent vertical scrolling inside the textarea
          ></textarea>
          <button
            type="submit"
            className="absolute bg-primary right-2 bottom-4 text-white p-2 rounded-full shadow focus:outline-none"
          >
            <FaCircleArrowUp className="bg-primary" />
          </button>
        </div>
      </form>
    </section>
  );
};

export default Dashboard;
